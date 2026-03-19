package com.surakshapay.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "disruptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Disruption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // e.g. RAIN, TEMPERATURE, AQI

    @Column(nullable = false)
    private String severity; // HIGH, CRITICAL

    @Column(nullable = false)
    private String location; // e.g., "Koramangala, Bangalore"

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
}
