package com.surakshapay.backend.services;

import org.springframework.stereotype.Service;

@Service
public class PayoutService {

    /**
     * Calculates the dynamic payout amount based on AI risk score, plan type, and policy coverage.
     * 
     * @param riskScore The AI-calculated risk score (0-100).
     * @param planType  The user's policy plan type (STANDARD, PREMIUM, etc.).
     * @param coverage  The maximum coverage amount for the policy.
     * @return The calculated payout amount, capped at the policy coverage.
     */
    public double calculatePayout(double riskScore, String planType, double coverage) {
        // Normalize risk score to a 0-1 factor
        double riskFactor = riskScore / 100.0;

        // Base payout is proportional to the risk factor and coverage (max 8% of coverage per trigger)
        double basePayout = coverage * riskFactor * 0.08;

        // Apply realistic plan-based multipliers for premium tiers
        double multiplier;
        switch (planType.toUpperCase()) {
            case "STANDARD":
                multiplier = 1.1;
                break;
            case "PREMIUM":
                multiplier = 1.25;
                break;
            default:
                multiplier = 1.0;
        }

        double payout = basePayout * multiplier;

        // Per-event cap at 10% of total coverage
        double maxPerEvent = coverage * 0.10;
        return Math.min(payout, maxPerEvent);
    }
}
