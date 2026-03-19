package com.surakshapay.backend.services;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

@Service
public class AiRiskEngineService {

    private final Random random = new Random();

    // Mock risk calculation based on location and historical data
    public RiskAssessment calculateRisk(String location, int expectedHoursPerWeek) {
        // Dummy logic to generate a risk score and weekly premium
        // Risk factor between 0.0 and 1.0 based on location hash
        double locationRiskFactor = Math.abs(location.hashCode() % 100) / 100.0;
        
        // Base premium varies between 10 and 50 INR
        double basePremium = 10.0 + (locationRiskFactor * 40.0);
        
        String riskScore;
        if (basePremium > 40) {
            riskScore = "HIGH";
        } else if (basePremium > 25) {
            riskScore = "MEDIUM";
        } else {
            riskScore = "LOW";
        }

        // Adjust slightly based on hours worked
        double finalPremiumDouble = basePremium * (1.0 + (expectedHoursPerWeek / 100.0));
        BigDecimal finalPremium = BigDecimal.valueOf(finalPremiumDouble).setScale(2, RoundingMode.HALF_UP);

        BigDecimal protectedEarnings = BigDecimal.valueOf(expectedHoursPerWeek * 150.0).setScale(2, RoundingMode.HALF_UP); // Assume 150/hr

        return new RiskAssessment(riskScore, finalPremium, protectedEarnings);
    }

    public static class RiskAssessment {
        public String riskScore;
        public BigDecimal weeklyPremium;
        public BigDecimal protectedEarnings;

        public RiskAssessment(String riskScore, BigDecimal weeklyPremium, BigDecimal protectedEarnings) {
            this.riskScore = riskScore;
            this.weeklyPremium = weeklyPremium;
            this.protectedEarnings = protectedEarnings;
        }
    }
}
