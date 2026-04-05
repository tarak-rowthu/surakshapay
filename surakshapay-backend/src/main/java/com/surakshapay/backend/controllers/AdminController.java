package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.services.ParametricTriggerService;
import com.surakshapay.backend.services.PayoutService;
import com.surakshapay.backend.services.RiskResult;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @Autowired
    private PayoutService payoutService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", InMemoryStore.users.size());
        stats.put("totalPolicies", InMemoryStore.policies.size());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/simulate-trigger")
    public ResponseEntity<?> simulateTrigger(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            
            Optional<User> userOpt = InMemoryStore.findUserById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            Policy activePolicy = InMemoryStore.findPoliciesByUserId(userId).stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .findFirst()
                    .orElse(null);

            if (activePolicy == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "No active policy found for user"));
            }

            String planType = activePolicy.getPlanType() != null ? activePolicy.getPlanType() : "BASIC";
            Double coverage = activePolicy.getCoverage() != null ? activePolicy.getCoverage().doubleValue() : 0.0;
            String triggerType = (String) request.getOrDefault("triggerType", "HEAT");

            RiskResult result = aiRiskEngineService.calculateRiskFromType(triggerType);
            double riskScore = result.getRiskScore();

            double payoutAmount = payoutService.calculatePayout(riskScore, planType, coverage);

            boolean isRecent = InMemoryStore.payouts.stream()
                    .anyMatch(p -> p.getUser().getId().equals(userId) && p.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5)));
            
            if (isRecent) {
                payoutAmount = payoutAmount * 0.5;
            }

            Payout payout = Payout.builder()
                    .amount(payoutAmount)
                    .riskScore(riskScore)
                    .triggerType(triggerType.toUpperCase())
                    .status("SUCCESS")
                    .createdAt(LocalDateTime.now())
                    .user(user)
                    .build();
            
            InMemoryStore.savePayout(payout);

            Optional<Wallet> walletOpt = InMemoryStore.findWalletByUserId(userId);
            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(payoutAmount)));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("amount", payoutAmount);
            response.put("riskScore", riskScore);
            response.put("message", isRecent ? "Payout processed (50% reduction applied for rapid trigger)" : "Payout processed");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Fatal error during trigger simulation: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("status", "ERROR", "message", "Error processing request"));
        }
    }
}
