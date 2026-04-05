package com.surakshapay.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Policy {
    private Long id;
    private User user;
    private String planType;
    private BigDecimal premium;
    private BigDecimal coverage;
    private PolicyStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
}
