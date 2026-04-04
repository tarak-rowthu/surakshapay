package com.surakshapay.backend.controllers;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.sql.Date;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.surakshapay.backend.models.Alert;
import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.Payout;
import com.surakshapay.backend.models.Wallet;
import com.surakshapay.backend.repositories.AlertRepository;
import com.surakshapay.backend.repositories.PolicyRepository;
import com.surakshapay.backend.repositories.PayoutRepository;
import com.surakshapay.backend.repositories.WalletRepository;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.dto.DashboardResponse;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getStats(@RequestParam Long userId) {
        try {
            List<Policy> policies = policyRepository.findByUser_Id(userId);
            List<Payout> payouts = payoutRepository.findByUserId(userId);

            BigDecimal totalPayouts = BigDecimal.valueOf(payouts.stream()
                    .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(Payout::getAmount)
                    .sum());

            boolean hasActivePolicy = policies.stream().anyMatch(p -> p.getStatus().name().equals("ACTIVE"));
            BigDecimal activeCoverage = policies.stream()
                    .filter(p -> p.getStatus().name().equals("ACTIVE"))
                    .map(Policy::getCoverage)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPremium = policies.stream()
                    .filter(p -> p.getStatus().name().equals("ACTIVE"))
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAlerts(@RequestParam Long userId) {
        try {
            List<Alert> alerts = alertRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("Error fetching alerts for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching alerts");
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getDashboard(@RequestParam Long userId) {
        try {
            log.info("Fetching consolidated dashboard data for user ID: {}", userId);
            
            // Get Payout History (Ordered by date)
            List<Payout> payouts = payoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (payouts == null) payouts = new ArrayList<>();

            // Calculate Total Payouts (SUCCESS only)
            double totalPayout = payouts.stream()
                .filter(p -> p.getStatus() != null && "SUCCESS".equalsIgnoreCase(p.getStatus().trim()))
                .mapToDouble(Payout::getAmount)
                .sum();

            // Get Wallet Balance
            double balance = walletRepository.findByUserId(userId)
                    .map(Wallet::getBalance)
                    .map(BigDecimal::doubleValue)
                    .orElse(0.0);

            // Get Alerts
            List<Alert> alerts = alertRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
            if (alerts == null) alerts = new ArrayList<>();

            // AI Risk Calculation (Robust way)
            // Using standard simulated inputs for the dashboard overview
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

            log.info("Dashboard API Response for user {}: score={}, total={}, balance={}", userId, riskScore, totalPayout, balance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching dashboard for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching dashboard");
        }
    }

    @GetMapping("/trends")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTrends(@RequestParam Long userId) {
        try {
            log.info("Fetching payout trends for user ID: {}", userId);
            List<Object[]> queryResults = payoutRepository.findPayoutTrendsByUserId(userId);
            
            List<String> dates = new ArrayList<>();
            List<Double> payouts = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
            
            for (Object[] result : queryResults) {
                Object dateObj = result[0];
                String formattedDate = dateObj.toString();
                
                if (dateObj instanceof java.sql.Date) {
                    formattedDate = ((java.sql.Date) dateObj).toLocalDate().format(formatter);
                } else if (dateObj instanceof java.time.LocalDate) {
                    formattedDate = ((java.time.LocalDate) dateObj).format(formatter);
                } else if (dateObj instanceof java.time.LocalDateTime) {
                    formattedDate = ((java.time.LocalDateTime) dateObj).format(formatter);
                }

                dates.add(formattedDate);
                payouts.add(Double.parseDouble(result[1].toString()));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("dates", dates);
            response.put("payouts", payouts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching trends for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error fetching trends");
        }
    }
}
