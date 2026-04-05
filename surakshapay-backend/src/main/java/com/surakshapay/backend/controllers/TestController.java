package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Backend is LIVE 🚀";
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return Arrays.asList(
            User.builder()
                .id(1L)
                .name("Tarak Rowthu")
                .email("tarak@surakshapay.com")
                .role(Role.ADMIN)
                .city("Hyderabad")
                .createdAt(LocalDateTime.now())
                .build(),
            User.builder()
                .id(2L)
                .name("John Doe")
                .email("john@example.com")
                .role(Role.USER)
                .city("New York")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build()
        );
    }

    @GetMapping("/policies")
    public List<Policy> getPolicies() {
        return Arrays.asList(
            Policy.builder()
                .id(101L)
                .planType("PREMIUM")
                .premium(new BigDecimal("99.99"))
                .coverage(new BigDecimal("10000.00"))
                .status(PolicyStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusYears(1))
                .build(),
            Policy.builder()
                .id(102L)
                .planType("BASIC")
                .premium(new BigDecimal("29.99"))
                .coverage(new BigDecimal("2000.00"))
                .status(PolicyStatus.ACTIVE)
                .startDate(LocalDateTime.now().minusMonths(2))
                .endDate(LocalDateTime.now().plusMonths(10))
                .build()
        );
    }
}
