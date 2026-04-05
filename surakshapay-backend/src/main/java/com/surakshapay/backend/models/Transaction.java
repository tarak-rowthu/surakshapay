package com.surakshapay.backend.models;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Transaction {
    private Long id;
    private User user;
    private BigDecimal amount;
    private String type;
    private String description;
    private LocalDateTime createdAt;
}
