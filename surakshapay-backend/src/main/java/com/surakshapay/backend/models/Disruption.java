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
public class Disruption {
    private Long id;
    private String type; 
    private String severity; 
    private String location; 
    private LocalDateTime timestamp;
}
