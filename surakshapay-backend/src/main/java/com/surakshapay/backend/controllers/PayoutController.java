package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Payout;
import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.PolicyStatus;
import com.surakshapay.backend.models.User;
import com.surakshapay.backend.models.Wallet;
import com.surakshapay.backend.repositories.PayoutRepository;
import com.surakshapay.backend.repositories.UserRepository;
import com.surakshapay.backend.repositories.WalletRepository;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.services.RiskResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PayoutController {
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PayoutController.class);
    
    
    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    /**
     * TRIGGER API: Handles AI risk, payout calculation, and manual saving.
     */
    @PostMapping("/trigger")
    public ResponseEntity<?> triggerPayout(@RequestBody Map<String, Object> payload) {
        Long userId = null;
        String triggerType = "HEAT";
        try {
            userId = Long.valueOf(payload.get("userId").toString());
            triggerType = payload.getOrDefault("triggerType", "HEAT").toString();
            log.info("Manual trigger called for user: {} type: {}", userId, triggerType);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Policy activePolicy = user.getPolicies().stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No active policy found"));

            // 1. Calculate AI Risk Score via the requested strongly-typed method
            RiskResult riskResult = aiRiskEngineService.calculateRiskFromType(triggerType);

            // 2. Compute dynamic payout based on risk score threshold
            double coverage = activePolicy.getCoverage().doubleValue();
            double finalPayoutAmount = 0;
            boolean eligible = false;
            double riskScore = riskResult.getRiskScore();

            if (riskScore > 70) {
                eligible = true;
                finalPayoutAmount = (riskScore / 100.0) * coverage;
            }

            finalPayoutAmount = Math.min(finalPayoutAmount, coverage); // Strict Capping

            if (!eligible) {
                 return ResponseEntity.ok(Map.of(
                    "status", "REJECTED",
                    "step", "Eligible",
                    "message", "Risk score below threshold 70",
                    "riskScore", riskScore,
                    "riskLevel", riskResult.getRiskLevel()
                ));
            }

            // 3. Save Payout FIRST
            Payout payout = Payout.builder()
                    .user(user)
                    .amount(finalPayoutAmount)
                    .riskScore(riskScore)
                    .triggerType(triggerType)
                    .status("PENDING") // Start as PENDING
                    .createdAt(LocalDateTime.now())
                    .build();
            
            payoutRepository.save(payout);

            // 4. Update Wallet ONLY IF PENDING transitions to SUCCESS
            // Here we assume immediate success for the manual trigger
            payout.setStatus("SUCCESS");
            payoutRepository.save(payout);

            Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(finalPayoutAmount)));
                walletRepository.save(wallet);
            }

            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "step", "Completed",
                "amount", finalPayoutAmount,
                "riskScore", riskResult.getRiskScore(),
                "riskLevel", riskResult.getRiskLevel()
            ));
        } catch (Exception e) {
            log.error("Trigger failure for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }

    private double getBasePayoutPercentage(int rainfall, int temp, int aqi) {
        if (rainfall > 80) return 0.6;
        if (temp > 45) return 0.6;
        if (aqi > 200) return 0.6;
        return 0.3;
    }

    private double getRiskModifier(double riskScore) {
        if (riskScore < 30) return 0.8;
        if (riskScore < 60) return 1.0;
        return 1.2;
    }

    /**
     * HISTORY API: Returns reverse chronological payout history.
     */
    @GetMapping("/payouts")
    public ResponseEntity<?> getPayoutHistory(@RequestParam Long userId) {
        try {
            log.info("Fetching payouts history for user: {}", userId);
            List<Payout> payouts = payoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(payouts != null ? payouts : new ArrayList<>());
        } catch (Exception e) {
            log.error("Error fetching history for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching history");
        }
    }

    /**
     * HISTORY API (alias): Frontend-friendly path for payout history.
     */
    @GetMapping("/payouts/history")
    public ResponseEntity<?> getPayoutHistoryAlias(@RequestParam Long userId) {
        try {
            log.info("Fetching payouts history (alias) for user: {}", userId);
            List<Payout> payouts = payoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(payouts != null ? payouts : new ArrayList<>());
        } catch (Exception e) {
            log.error("Error fetching history for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching history");
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getHistoryByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(payoutRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    /**
     * TOTAL PAYOUT API: Returns aggregated successful payout sum.
     */
    @GetMapping("/payouts/total")
    public ResponseEntity<?> getTotalPayout(@RequestParam Long userId) {
        try {
            Double total = payoutRepository.getTotalPayoutByUserId(userId);
            if (total == null) total = 0.0;
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            log.error("Error fetching total for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/payouts/summary")
    public ResponseEntity<?> getPayoutSummary(@RequestParam Long userId) {
        try {
            log.info("Fetching payout summary for user: {}", userId);
            List<Payout> payouts = payoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
            Double total = payoutRepository.getTotalPayoutByUserId(userId);
            if (total == null) total = 0.0;

            Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
            BigDecimal balance = walletOpt.isPresent() ? walletOpt.get().getBalance() : BigDecimal.ZERO;

            Map<String, Object> summary = new HashMap<>();
            summary.put("total", total);
            summary.put("count", payouts.size());
            summary.put("latest", payouts.isEmpty() ? null : payouts.get(0));
            summary.put("balance", balance);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error fetching summary for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching metrics");
        }
    }

    @GetMapping("/payouts/latest")
    public ResponseEntity<?> getLatestPayout(@RequestParam Long userId) {
        try {
            List<Payout> payouts = payoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(payouts.isEmpty() ? null : payouts.get(0));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching latest payout");
        }
    }

    /**
     * DAILY TREND API: Returns daily payout aggregation for the graph.
     */
    @GetMapping("/payouts/daily")
    public ResponseEntity<?> getDailyPayouts(@RequestParam Long userId) {
        try {
            List<Object[]> rows = payoutRepository.getDailyPayouts(userId);
            List<Map<String, Object>> result = new ArrayList<>();
            for (Object[] row : rows) {
                Map<String, Object> map = new HashMap<>();
                map.put("day", row[0].toString());
                map.put("amount", ((Number) row[1]).doubleValue());
                result.add(map);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching daily payouts for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }
}
