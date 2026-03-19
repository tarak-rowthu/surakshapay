package com.surakshapay.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String location;
    private String role; // optional
}
