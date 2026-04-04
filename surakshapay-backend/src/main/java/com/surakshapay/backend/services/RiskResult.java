package com.surakshapay.backend.services;

public class RiskResult {
    private double riskScore;
    private String riskLevel;

    public RiskResult(double riskScore, String riskLevel) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }
}
