package com.surakshapay.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Claim {
    private Long id;
    private Policy policy;
    private BigDecimal amount;
    private ClaimStatus status;
    private String triggeredBy;
    private String triggerCondition;
    private LocalDateTime createdAt;
}
