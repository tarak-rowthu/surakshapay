package com.surakshapay.backend.services;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.repositories.ClaimRepository;
import com.surakshapay.backend.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ParametricTriggerService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

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
        // Payout = base_income * time_factor * severity_factor
        BigDecimal baseIncome = policy.getProtectedEarnings().divide(BigDecimal.valueOf(7), 2, RoundingMode.HALF_UP); // Daily base
        
        BigDecimal severityFactor = severity.equals("CRITICAL") ? BigDecimal.valueOf(0.5) : BigDecimal.valueOf(0.25);
        
        // Payout per triggered event
        BigDecimal payoutAmount = baseIncome.multiply(severityFactor).setScale(2, RoundingMode.HALF_UP);

        Claim claim = Claim.builder()
                .policy(policy)
                .amount(payoutAmount)
                .status(ClaimStatus.PAID) // Auto-paid in parametric
                .triggeredBy("AI_WEATHER_ORACLE")
                .triggerCondition(eventType + " " + severity)
                .build();

        claimRepository.save(claim);
        
        System.out.println("Auto payout generated for User " + policy.getUser().getName() + ": INR " + payoutAmount);
    }
}
