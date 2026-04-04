package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.PolicyStatus;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.services.ParametricTriggerService;
import com.surakshapay.backend.services.PayoutService;
import com.surakshapay.backend.repositories.PolicyRepository;
import com.surakshapay.backend.repositories.UserRepository;
import com.surakshapay.backend.repositories.WalletRepository;
import com.surakshapay.backend.repositories.PayoutRepository;
import com.surakshapay.backend.models.Wallet;
import com.surakshapay.backend.models.Payout;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.surakshapay.backend.services.RiskResult;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import com.surakshapay.backend.models.User;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {
 
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminController.class);
    

    @Autowired
    private ParametricTriggerService parametricTriggerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @Autowired
    private PayoutService payoutService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPolicies", policyRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/simulate-trigger")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> simulateTrigger(@RequestBody Map<String, Object> request) {
        try {
            log.info("Simulate trigger API HIT with request: {}", request);
            
            Long userId = Long.valueOf(request.get("userId").toString());
            
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "UserId is required"));
            }

            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            // Fetch users active policy
            Policy activePolicy = user.getPolicies().stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .findFirst()
                    .orElse(null);

            if (activePolicy == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "No active policy found for user"));
            }

            String planType = activePolicy.getPlanType() != null ? activePolicy.getPlanType() : "BASIC";
            Double coverage = activePolicy.getCoverage() != null ? activePolicy.getCoverage().doubleValue() : 0.0;
            String triggerType = (String) request.getOrDefault("triggerType", "HEAT");

            // Calculate dynamic risk and payout
            RiskResult result = aiRiskEngineService.calculateRiskFromType(triggerType);
            double riskScore = result.getRiskScore();
            String riskLevel = result.getRiskLevel();

            System.out.println("--- Payout Simulation Debug ---");
            System.out.println("User ID: " + userId);
            System.out.println("Plan: " + planType);
            System.out.println("Coverage: " + coverage);
            System.out.println("Risk: " + riskScore);

            double payoutAmount = payoutService.calculatePayout(
                    riskScore, 
                    planType, 
                    coverage
            );

            // Anti-Abuse Logic: 50% reduction for rapid repeats (within 5 mins)
            boolean isRecent = payoutRepository.existsByUserIdAndCreatedAtAfter(userId, LocalDateTime.now().minusMinutes(5));
            if (isRecent) {
                payoutAmount = payoutAmount * 0.5;
            }

            // 1. Save Payout with SUCCESS
            Payout payout = Payout.builder()
                    .amount(payoutAmount)
                    .riskScore(riskScore)
                    .triggerType(triggerType.toUpperCase())
                    .status("SUCCESS")
                    .createdAt(LocalDateTime.now())
                    .user(user)
                    .build();
            payoutRepository.save(payout);

            // 2. Update Wallet Balance
            java.util.Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(payoutAmount)));
                walletRepository.save(wallet);
                log.info("Wallet updated for user {}. New Balance: {}", userId, wallet.getBalance());
            }

            // 3. Return response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("amount", payoutAmount);
            response.put("riskScore", riskScore);
            response.put("message", isRecent ? "Payout processed (50% reduction applied for rapid trigger)" : "Payout processed");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Fatal error during trigger simulation for user {}: {}", request.get("userId"), e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("status", "ERROR", "message", "Error processing request"));
        }
    }
}
