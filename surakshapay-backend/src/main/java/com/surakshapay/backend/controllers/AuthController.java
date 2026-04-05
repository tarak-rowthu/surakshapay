package com.surakshapay.backend.controllers;

import com.surakshapay.backend.dto.JwtResponse;
import com.surakshapay.backend.dto.LoginRequest;
import com.surakshapay.backend.dto.MessageResponse;
import com.surakshapay.backend.dto.SignupRequest;
import com.surakshapay.backend.models.*;
import com.surakshapay.backend.security.JwtUtils;
import com.surakshapay.backend.security.UserDetailsImpl;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String inputEmail = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword();

        if (inputEmail == null || inputEmail.trim().isEmpty() || rawPassword == null || rawPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email and Password are required"));
        }

        String searchEmail = inputEmail.trim().toLowerCase();
        User user = InMemoryStore.findUserByEmail(searchEmail).orElse(null);

        if (user != null) {
            if (!encoder.matches(rawPassword, user.getPassword())) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid password"));
            }

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(searchEmail, "ROLE_" + user.getRole().name());

            List<String> roles = java.util.List.of("ROLE_" + user.getRole().name());

            return ResponseEntity.ok(new JwtResponse(
                    "SUCCESS", 
                    "Login successful",
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    userDetails.getCity(),
                    userDetails.getLocation(),
                    roles));
        } else {
            return ResponseEntity.status(401).body(new MessageResponse("Error: User not found"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        log.info("Starting registration for email: {}", signUpRequest.getEmail());

        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required"));
        }

        String email = signUpRequest.getEmail().trim().toLowerCase();
        if (InMemoryStore.findUserByEmail(email).isPresent()) {
            return ResponseEntity.status(409).body(new MessageResponse("Error: Email already registered"));
        }

        Role userRole = signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("ADMIN") 
                        ? Role.ADMIN : Role.USER;

        User user = User.builder()
                .name(signUpRequest.getName() != null ? signUpRequest.getName() : "User")
                .email(email)
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(userRole)
                .city(signUpRequest.getCity() != null ? signUpRequest.getCity() : "Unknown")
                .location(signUpRequest.getLocation() != null ? signUpRequest.getLocation() : "Unknown")
                .createdAt(LocalDateTime.now())
                .build();

        user = InMemoryStore.saveUser(user);

        // Create Wallet
        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .build();
        InMemoryStore.saveWallet(wallet);

        // Create Initial Policy
        String planType = signUpRequest.getPlanType() != null ? signUpRequest.getPlanType() : "Standard";
        BigDecimal premium = signUpRequest.getPremium() != null ? signUpRequest.getPremium() : new BigDecimal("0");
        BigDecimal coverage = signUpRequest.getCoverage() != null ? signUpRequest.getCoverage() : new BigDecimal("10000");

        Policy policy = Policy.builder()
                .user(user)
                .planType(planType)
                .premium(premium)
                .coverage(coverage)
                .status(PolicyStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusWeeks(1))
                .createdAt(LocalDateTime.now())
                .build();

        InMemoryStore.savePolicy(policy);

        return ResponseEntity.ok(new MessageResponse("User registered successfully with in-memory wallet and policy!"));
    }
}
