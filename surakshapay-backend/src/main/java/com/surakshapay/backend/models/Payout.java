package com.surakshapay.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payout {
    private Long id;
    private Double amount;
    private Double riskScore;
    private String triggerType;
    private String status;
    private LocalDateTime createdAt;
    private User user;
}
