package com.surakshapay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.surakshapay.backend.models.Payout;
import com.surakshapay.backend.models.Alert;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private int riskScore;
    private String riskLevel;
    private double totalPayout;
    private double balance;
    private List<Payout> payouts;
    private List<Alert> alerts;
}
