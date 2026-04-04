package com.surakshapay.backend.services;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class AutoPayoutService {

    @Autowired private PolicyRepository policyRepository;
    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private PayoutRepository payoutRepository;
    @Autowired private AlertService alertService;
    @Autowired private PaymentService paymentService;
    @Autowired private AiRiskEngineService aiRiskEngineService;
    private final Random random = new Random();

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void simulateWeatherAndPayout() {
        List<Policy> activePolicies = policyRepository.findByStatus(PolicyStatus.ACTIVE);

        for (Policy policy : activePolicies) {
            // 1. SIMULATE WEATHER (Real-world ranges for testing)
            int rainfall = random.nextInt(100);
            int temp = 30 + random.nextInt(20);
            int aqi = 100 + random.nextInt(200);

            // 2. CALCULATE DYNAMIC AI RISK SCORE (strongly typed)
            RiskResult result = aiRiskEngineService.calculateRisk(rainfall, temp, aqi, 50.0);
            double riskScore = result.getRiskScore();
            String riskLevel = result.getRiskLevel();

            // 3. DETERMINE TRIGGER TYPE
            String triggerType = "HEAT";
            if (rainfall > 60) triggerType = "RAIN";
            else if (aqi > 200) triggerType = "POLLUTION";

            User user = policy.getUser();

            // 4. REALISTIC CONSTRAINT: Max Payouts Per Day Limit (e.g. max 3 payouts)
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            long dailyPayoutsCount = payoutRepository.countByUserIdAndCreatedAtAfter(user.getId(), startOfDay);
            if (dailyPayoutsCount >= 3) {
                continue; // Stop processing if max limit reached
            }

            // 5. FRAUD PREVENTION (5-min Cooldown)
            LocalDateTime cutoff = LocalDateTime.now().minusMinutes(5);
            if (payoutRepository.existsByUserIdAndTriggerTypeAndCreatedAtAfter(user.getId(), triggerType, cutoff)) {
                continue;
            }

            // 6. CALCULATE FINAL AMOUNT BASED ON RISK LEVEL
            double coverage = policy.getCoverage().doubleValue();
            double finalPayoutAmount = 0;

            if ("Low".equalsIgnoreCase(riskLevel)) {
                finalPayoutAmount = coverage * 0.10;
            } else if ("Moderate".equalsIgnoreCase(riskLevel)) {
                finalPayoutAmount = coverage * 0.30;
            } else {
                // High Risk: Scale between 60% and 100% depending on the specific score
                double highSlabScale = 0.60 + ((riskScore - 70.0) / 30.0) * 0.40;
                finalPayoutAmount = coverage * Math.min(highSlabScale, 1.0);
            }

            // Must reach at least Moderate to auto-trigger payout in background
            if ("Low".equalsIgnoreCase(riskLevel)) {
                continue; 
            }

            finalPayoutAmount = Math.min(finalPayoutAmount, coverage); // Cap at coverage

            // 7. PERSIST PAYOUT (Save First)
            Payout payout = Payout.builder()
                    .user(user)
                    .amount(finalPayoutAmount)
                    .triggerType(triggerType)
                    .riskScore(riskScore)
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();

            payout = payoutRepository.save(payout);

            // 8. PROCESS PAYMENT
            try {
                paymentService.processPayment(payout);
                if ("SUCCESS".equals(payout.getStatus())) {
                    finalizePayoutSuccess(user, walletRepository.findByUserId(user.getId()).orElse(null), finalPayoutAmount, triggerType);
                }
            } catch (Exception e) {
                payout.setStatus("FAILED");
                payoutRepository.save(payout);
                alertService.generateAlert(user.getId(), "ERROR", "Payment FAILED: ₹" + finalPayoutAmount);
            }
        }
    }

    private double getBasePayoutPercentage(int rainfall, int temp, int aqi) {
        // Rain Slabs
        if (rainfall > 120) return 1.0;
        if (rainfall > 80) return 0.6;
        if (rainfall > 50) return 0.3;

        // Heat Slabs
        if (temp > 48) return 1.0;
        if (temp > 45) return 0.6;
        if (temp > 40) return 0.3;

        // Pollution Slabs
        if (aqi > 300) return 1.0;
        if (aqi > 200) return 0.6;
        if (aqi > 150) return 0.3;

        return 0;
    }

    private double getRiskModifier(double riskScore) {
        if (riskScore < 30) return 0.8;
        if (riskScore < 60) return 1.0;
        if (riskScore < 80) return 1.2;
        return 1.5;
    }

    private void finalizePayoutSuccess(User user, Wallet wallet, double amount, String type) {
        if (wallet != null) {
            wallet.setBalance(wallet.getBalance().add(java.math.BigDecimal.valueOf(amount)));
            walletRepository.save(wallet);

            Transaction tx = Transaction.builder()
                    .user(user)
                    .amount(java.math.BigDecimal.valueOf(amount))
                    .type("CREDIT")
                    .description("AI-Verified Parametric Payout: " + type)
                    .createdAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(tx);
            alertService.generateAlert(user.getId(), "SUCCESS", "Payout Credited: ₹" + amount);
        }
    }
}
