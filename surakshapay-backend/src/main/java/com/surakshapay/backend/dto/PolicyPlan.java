package com.surakshapay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyPlan {
    private String planType;
    private BigDecimal premium;
    private BigDecimal coverage;
}
