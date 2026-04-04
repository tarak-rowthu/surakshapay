package com.surakshapay.backend.services;

import org.springframework.stereotype.Service;

@Service
public class AiRiskEngineService {

    public double calculateRiskScore(int rain, int temp, int aqi, double previous) {
        double rainScore = Math.min(rain * 1.0, 100);
        double tempScore = Math.max(0, Math.min((temp - 30) * 5, 100));
        double aqiScore = Math.max(0, Math.min(aqi / 3.0, 100));
        double trendScore = Math.min(previous * 0.2, 100);

        double score = (rainScore * 0.4) + 
                       (tempScore * 0.3) + 
                       (aqiScore * 0.2) + 
                       (trendScore * 0.1);

        return Math.min(score, 100);
    }

    public RiskResult calculateRisk(int rain, int temp, int aqi, double previous) {
        double score = calculateRiskScore(rain, temp, aqi, previous);
        String level = getRiskLevel((int) score);
        return new RiskResult(score, level);
    }

    public RiskResult calculateRiskFromType(String triggerType) {
        if ("Rain".equalsIgnoreCase(triggerType)) {
            return calculateRisk(100, 30, 80, 40.0);
        } else if ("Heat".equalsIgnoreCase(triggerType)) {
            return calculateRisk(20, 46, 100, 50.0);
        } else if ("Pollution".equalsIgnoreCase(triggerType)) {
            return calculateRisk(10, 35, 300, 45.0);
        }
        return calculateRisk(20, 30, 80, 40.0); // Default safe weather
    }

    public String getRiskLevel(int score) {
        if (score <= 30) return "Low";
        if (score <= 70) return "Moderate";
        return "High";
    }

    public RiskResult calculateRisk() {
        return calculateRisk(30, 35, 150, 40.0);
    }
}
