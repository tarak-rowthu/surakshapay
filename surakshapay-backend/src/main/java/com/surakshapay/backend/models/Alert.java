package com.surakshapay.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    private String type; // e.g., "Heat", "Rain"
    
    private String message;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
