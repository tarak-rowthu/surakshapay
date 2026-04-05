package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.store.InMemoryStore;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.services.RiskResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PayoutController {
    
    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerPayout(@RequestBody Map<String, Object> payload) {
        Long userId = null;
        try {
            userId = Long.valueOf(payload.get("userId").toString());
            String triggerType = payload.getOrDefault("triggerType", "HEAT").toString();
            
            User user = InMemoryStore.findUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Policy activePolicy = InMemoryStore.findPoliciesByUserId(userId).stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No active policy found"));

            RiskResult riskResult = aiRiskEngineService.calculateRiskFromType(triggerType);

            double coverage = activePolicy.getCoverage().doubleValue();
            double finalPayoutAmount = 0;
            boolean eligible = false;
            double riskScore = riskResult.getRiskScore();

            if (riskScore > 70) {
                eligible = true;
                finalPayoutAmount = (riskScore / 100.0) * coverage;
            }

            finalPayoutAmount = Math.min(finalPayoutAmount, coverage);

            if (!eligible) {
                 return ResponseEntity.ok(Map.of(
                    "status", "REJECTED",
                    "step", "Eligible",
                    "message", "Risk score below threshold 70",
                    "riskScore", riskScore,
                    "riskLevel", riskResult.getRiskLevel()
                ));
            }

            Payout payout = Payout.builder()
                    .user(user)
                    .amount(finalPayoutAmount)
                    .riskScore(riskScore)
                    .triggerType(triggerType)
                    .status("SUCCESS")
                    .createdAt(LocalDateTime.now())
                    .build();
            
            InMemoryStore.savePayout(payout);

            Optional<Wallet> walletOpt = InMemoryStore.findWalletByUserId(userId);
            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(finalPayoutAmount)));
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

    @GetMapping("/payouts")
    public ResponseEntity<?> getPayoutHistory(@RequestParam Long userId) {
        log.info("Fetching payouts history for user: {}", userId);
        return ResponseEntity.ok(InMemoryStore.findPayoutsByUserId(userId));
    }

    @GetMapping("/payouts/history")
    public ResponseEntity<?> getPayoutHistoryAlias(@RequestParam Long userId) {
        return ResponseEntity.ok(InMemoryStore.findPayoutsByUserId(userId));
    }

    @GetMapping("/payouts/total")
    public ResponseEntity<?> getTotalPayout(@RequestParam Long userId) {
        double total = InMemoryStore.findPayoutsByUserId(userId).stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payout::getAmount)
                .sum();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/payouts/summary")
    public ResponseEntity<?> getPayoutSummary(@RequestParam Long userId) {
        List<Payout> payouts = InMemoryStore.findPayoutsByUserId(userId);
        double total = payouts.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payout::getAmount)
                .sum();

        BigDecimal balance = InMemoryStore.findWalletByUserId(userId)
                .map(Wallet::getBalance)
                .orElse(BigDecimal.ZERO);

        Map<String, Object> summary = new HashMap<>();
        summary.put("total", total);
        summary.put("count", payouts.size());
        summary.put("latest", payouts.isEmpty() ? null : payouts.get(payouts.size() - 1));
        summary.put("balance", balance);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/payouts/latest")
    public ResponseEntity<?> getLatestPayout(@RequestParam Long userId) {
        List<Payout> payouts = InMemoryStore.findPayoutsByUserId(userId);
        return ResponseEntity.ok(payouts.isEmpty() ? null : payouts.get(payouts.size() - 1));
    }
}
