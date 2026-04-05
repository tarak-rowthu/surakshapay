package com.surakshapay.backend.models;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    private Long id;
    private User user;
    private String type; 
    private String message;
    private LocalDateTime createdAt;
}
