package com.surakshapay.backend.models;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Wallet {
    private Long id;
    private User user;
    private BigDecimal balance;
}
