package com.surakshapay.backend.services;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class AutoPayoutService {

    @Autowired private AlertService alertService;
    @Autowired private PaymentService paymentService;
    @Autowired private AiRiskEngineService aiRiskEngineService;
    private final Random random = new Random();

    @Scheduled(fixedRate = 60000)
    public void simulateWeatherAndPayout() {
        List<Policy> activePolicies = InMemoryStore.policies.stream()
                .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                .toList();

        for (Policy policy : activePolicies) {
            // 1. SIMULATE WEATHER
            int rainfall = random.nextInt(100);
            int temp = 30 + random.nextInt(20);
            int aqi = 100 + random.nextInt(200);

            // 2. CALCULATE AI RISK
            RiskResult result = aiRiskEngineService.calculateRisk(rainfall, temp, aqi, 50.0);
            double riskScore = result.getRiskScore();
            String riskLevel = result.getRiskLevel();

            // 3. DETERMINE TRIGGER TYPE
            String triggerType = rainfall > 60 ? "RAIN" : (aqi > 200 ? "POLLUTION" : "HEAT");

            User user = policy.getUser();

            // 4. DAILY LIMIT
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            long dailyPayoutsCount = InMemoryStore.payouts.stream()
                    .filter(p -> p.getUser().getId().equals(user.getId()) && p.getCreatedAt().isAfter(startOfDay))
                    .count();
            if (dailyPayoutsCount >= 3) continue;

            // 5. COOLDOWN
            LocalDateTime cutoff = LocalDateTime.now().minusMinutes(5);
            boolean exists = InMemoryStore.payouts.stream()
                    .anyMatch(p -> p.getUser().getId().equals(user.getId()) && p.getTriggerType().equals(triggerType) && p.getCreatedAt().isAfter(cutoff));
            if (exists) continue;

            // 6. CALCULATE AMOUNT
            double coverage = policy.getCoverage().doubleValue();
            double finalPayoutAmount = 0;

            if ("Low".equalsIgnoreCase(riskLevel)) continue;
            else if ("Moderate".equalsIgnoreCase(riskLevel)) finalPayoutAmount = coverage * 0.30;
            else {
                double highSlabScale = 0.60 + ((riskScore - 70.0) / 30.0) * 0.40;
                finalPayoutAmount = coverage * Math.min(highSlabScale, 1.0);
            }
            finalPayoutAmount = Math.min(finalPayoutAmount, coverage);

            // 7. PERSIST PAYOUT
            Payout payout = Payout.builder()
                    .user(user)
                    .amount(finalPayoutAmount)
                    .triggerType(triggerType)
                    .riskScore(riskScore)
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();

            payout = InMemoryStore.savePayout(payout);

            // 8. PROCESS PAYMENT
            try {
                paymentService.processPayment(payout);
                if ("SUCCESS".equals(payout.getStatus())) {
                    finalizePayoutSuccess(user, InMemoryStore.findWalletByUserId(user.getId()).orElse(null), finalPayoutAmount, triggerType);
                }
            } catch (Exception e) {
                payout.setStatus("FAILED");
                alertService.generateAlert(user.getId(), "ERROR", "Payment FAILED: ₹" + finalPayoutAmount);
            }
        }
    }

    private void finalizePayoutSuccess(User user, Wallet wallet, double amount, String type) {
        if (wallet != null) {
            wallet.setBalance(wallet.getBalance().add(java.math.BigDecimal.valueOf(amount)));
            Transaction tx = Transaction.builder()
                    .user(user)
                    .amount(java.math.BigDecimal.valueOf(amount))
                    .type("CREDIT")
                    .description("AI-Verified Parametric Payout: " + type)
                    .createdAt(LocalDateTime.now())
                    .build();
            // Simulating transaction save
            alertService.generateAlert(user.getId(), "SUCCESS", "Payout Credited: ₹" + amount);
        }
    }
}
