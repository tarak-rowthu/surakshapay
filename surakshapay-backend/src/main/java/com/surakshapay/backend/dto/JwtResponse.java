package com.surakshapay.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String status;
    private String message;
    private String token;
    private Long id;
    private String name;
    private String email;
    private String city;
    private String location;
    private List<String> roles;

    public JwtResponse(String status, String message, String token, Long id, String name, String email, String city, String location, List<String> roles) {
        this.status = status;
        this.message = message;
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.city = city;
        this.location = location;
        this.roles = roles;
    }
}
