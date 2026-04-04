package com.surakshapay.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String city;
    private String location;
    private String planType;
    private java.math.BigDecimal premium;
    private java.math.BigDecimal coverage;
    private String role; // optional
}
