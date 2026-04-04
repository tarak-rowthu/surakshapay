package com.surakshapay.backend.services;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.repositories.PayoutRepository;
import com.surakshapay.backend.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ParametricTriggerService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private PayoutRepository payoutRepository;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private PaymentService paymentService;

    // Simulate parametric trigger
    @Transactional
    public void simulateWeatherEvent(String location, String eventType, String severity) {
        // Fetch active policies for mock payout calculation
        List<Policy> activePolicies = policyRepository.findByStatus(PolicyStatus.ACTIVE);

        for (Policy policy : activePolicies) {
            // Simplified logic: If the policy user location matches and conditions met
            if (policy.getUser().getLocation().equalsIgnoreCase(location)) {
                generateAutoPayout(policy, eventType, severity);
            }
        }
    }

    private void generateAutoPayout(Policy policy, String eventType, String severity) {
        BigDecimal amount = BigDecimal.ZERO;
        java.util.Random random = new java.util.Random();
        
        if (eventType.equalsIgnoreCase("Heat") || eventType.toLowerCase().contains("temp")) {
            int temperature = severity.equals("CRITICAL") ? 48 : 46;
            if (temperature > 45) {
                amount = amount.add(BigDecimal.valueOf(300 + (temperature - 45) * 50));
            }
        } 
        
        if (eventType.equalsIgnoreCase("Rain") || eventType.toLowerCase().contains("rain")) {
            int rainfall = severity.equals("CRITICAL") ? 80 : 60;
            if (rainfall > 50) {
                amount = amount.add(BigDecimal.valueOf(500 + (rainfall - 50) * 20));
            }
        } 
        
        if (eventType.equalsIgnoreCase("Pollution") || eventType.toLowerCase().contains("aqi")) {
            int aqi = severity.equals("CRITICAL") ? 350 : 250;
            if (aqi > 200) {
                amount = amount.add(BigDecimal.valueOf(200 + (aqi - 200) * 2));
            }
        }
        
        if (amount.compareTo(BigDecimal.ZERO) == 0) {
            amount = BigDecimal.valueOf(400); // safe fallback
        }
        
        // Random variation (10 to 100)
        amount = amount.add(BigDecimal.valueOf(10 + random.nextInt(91)));
        
        // --- FRAUD DETECTION CHECKS ---
        Long userId = policy.getUser().getId();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        // CHECK 1: 5-MIN LOCKOUT (Prevent Duplicate)
        // CHECK 1: 5-MIN LOCKOUT (Prevent Duplicate)
        if (payoutRepository.existsByUserIdAndTriggerTypeAndCreatedAtAfter(userId, eventType, now.minusMinutes(5))) {
            System.out.println("Duplicate payout prevented for user " + userId + " - " + eventType);
            alertService.generateAlert(userId, "WARNING", "Duplicate payout blocked");
            return;
        }

        // CAP 2: Daily limit of 5000 payouts per user
        Double dailyTotal = payoutRepository.sumAmountByUserIdAndCreatedAtAfter(userId, now.toLocalDate().atStartOfDay());
        if (dailyTotal > 5000.0) {
            System.out.println("Daily payout limit exceeded for user " + userId);
            return;
        }

        // CAP 3: Do not trigger more than 3 times in 10 minutes
        // CAP 3: Do not trigger more than 3 times in 10 minutes
        long recentTriggers = payoutRepository.countByUserIdAndCreatedAtAfter(userId, now.minusMinutes(10));
        if (recentTriggers >= 3) {
            System.out.println("Too many triggers in last 10 minutes for user " + userId);
            return;
        }

        Payout payout = Payout.builder()
                .user(policy.getUser())
                .amount(amount.doubleValue())
                .triggerType(eventType)
                .riskScore(70.0)
                .status("PENDING")
                .createdAt(now)
                .build();

        System.out.println("Creating payout with PENDING");
        // SAVE FIRST
        payout = payoutRepository.save(payout);

        System.out.println("Processing payout to SUCCESS");
        // REQUIRED FIX (MOST IMPORTANT)
        paymentService.processPayment(payout);
        if ("FAILED".equals(payout.getStatus())) {
            System.out.println("Retry #1: Attempting payment again for User " + userId);
            paymentService.processPayment(payout);
        }
        
        if ("SUCCESS".equals(payout.getStatus())) {
            String msg = String.format("%s Trigger | Amount: ₹%.2f | Location: %s", eventType, payout.getAmount(), policy.getUser().getLocation());
            alertService.generateAlert(userId, "SUCCESS", msg);
        } else {
            String msg = String.format("FAILED %s Trigger | Amount: ₹%.2f | Location: %s", eventType, payout.getAmount(), policy.getUser().getLocation());
            alertService.generateAlert(userId, "ERROR", msg);
        }
        
        log.info("Auto payout generated for User {}: INR {}", policy.getUser().getName(), amount);
    }
}
