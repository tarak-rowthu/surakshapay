package com.surakshapay.backend.controllers;

import java.util.*;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.store.InMemoryStore;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.dto.DashboardResponse;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam Long userId) {
        try {
            List<Policy> policies = InMemoryStore.findPoliciesByUserId(userId);
            List<Payout> payouts = InMemoryStore.findPayoutsByUserId(userId);

            BigDecimal totalPayouts = BigDecimal.valueOf(payouts.stream()
                    .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(Payout::getAmount)
                    .sum());

            boolean hasActivePolicy = policies.stream().anyMatch(p -> p.getStatus() == PolicyStatus.ACTIVE);
            BigDecimal activeCoverage = policies.stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .map(Policy::getCoverage)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPremium = policies.stream()
                    .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                    .map(Policy::getPremium)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPayouts", totalPayouts);
            stats.put("hasActivePolicy", hasActivePolicy);
            stats.put("activeCoverage", activeCoverage);
            stats.put("totalPremium", totalPremium);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching stats for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching stats");
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(@RequestParam Long userId) {
        try {
            List<Alert> alerts = InMemoryStore.findAlertsByUserId(userId);
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("Error fetching alerts for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching alerts");
        }
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(@RequestParam Long userId) {
        try {
            log.info("Fetching consolidated dashboard data for user ID: {}", userId);
            
            List<Payout> payouts = InMemoryStore.findPayoutsByUserId(userId);
            
            double totalPayout = payouts.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payout::getAmount)
                .sum();

            double balance = InMemoryStore.findWalletByUserId(userId)
                    .map(Wallet::getBalance)
                    .map(BigDecimal::doubleValue)
                    .orElse(0.0);

            List<Alert> alerts = InMemoryStore.findAlertsByUserId(userId);

            com.surakshapay.backend.services.RiskResult riskData = aiRiskEngineService.calculateRisk(30, 42, 180, 50.0);
            int riskScore = (int) riskData.getRiskScore();
            String riskLevel = riskData.getRiskLevel();

            DashboardResponse response = DashboardResponse.builder()
                .riskScore(riskScore)
                .riskLevel(riskLevel)
                .totalPayout(totalPayout)
                .balance(balance)
                .payouts(payouts)
                .alerts(alerts)
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching dashboard for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching dashboard");
        }
    }

    @GetMapping("/trends")
    public ResponseEntity<?> getTrends(@RequestParam Long userId) {
        try {
            List<Payout> payoutsList = InMemoryStore.findPayoutsByUserId(userId);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
            
            Map<String, Double> trendsMap = payoutsList.stream()
                    .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                    .collect(Collectors.groupingBy(
                            p -> p.getCreatedAt().format(formatter),
                            TreeMap::new,
                            Collectors.summingDouble(Payout::getAmount)
                    ));

            Map<String, Object> response = new HashMap<>();
            response.put("dates", new ArrayList<>(trendsMap.keySet()));
            response.put("payouts", new ArrayList<>(trendsMap.values()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching trends for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching trends");
        }
    }
}
