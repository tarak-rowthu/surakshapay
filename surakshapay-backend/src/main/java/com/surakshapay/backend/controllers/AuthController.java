package com.surakshapay.backend.controllers;

import com.surakshapay.backend.dto.JwtResponse;
import com.surakshapay.backend.dto.LoginRequest;
import com.surakshapay.backend.dto.MessageResponse;
import com.surakshapay.backend.dto.SignupRequest;
import com.surakshapay.backend.models.Role;
import com.surakshapay.backend.models.User;
import com.surakshapay.backend.repositories.UserRepository;
import com.surakshapay.backend.security.JwtUtils;
import com.surakshapay.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import com.surakshapay.backend.models.Wallet;
import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.PolicyStatus;
import com.surakshapay.backend.repositories.WalletRepository;
import com.surakshapay.backend.repositories.PolicyRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    WalletRepository walletRepository;

    @Autowired
    PolicyRepository policyRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String inputEmail = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword();

        if (inputEmail == null || inputEmail.trim().isEmpty() || rawPassword == null || rawPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email and Password are required"));
        }

        String searchEmail = inputEmail.trim().toLowerCase();
        java.util.Optional<com.surakshapay.backend.models.User> userOpt = userRepository.findByEmail(searchEmail);

        if (userOpt.isPresent()) {
            com.surakshapay.backend.models.User user = userOpt.get();

            boolean isMatch = encoder.matches(rawPassword, user.getPassword());

            if (!isMatch) {
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
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        log.info("Starting registration for email: {}", signUpRequest.getEmail());

        // 1. Validation
        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().isEmpty()) {
            log.warn("Registration failed: Email is missing");
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required"));
        }
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().isEmpty()) {
            log.warn("Registration failed: Password is missing");
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required"));
        }

        String email = signUpRequest.getEmail().trim().toLowerCase();

        // 2. Check for existing user
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Registration failed: Email {} already exists", email);
            return ResponseEntity
                    .status(org.springframework.http.HttpStatus.CONFLICT)
                    .body(new MessageResponse("USER_ALREADY_EXISTS: Email already registered"));
        }

        try {
            // 3. Create User
            Role userRole = signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("ADMIN") 
                            ? Role.ADMIN : Role.USER;

            User user = User.builder()
                    .name(signUpRequest.getName() != null ? signUpRequest.getName() : "User")
                    .email(email)
                    .password(encoder.encode(signUpRequest.getPassword()))
                    .role(userRole)
                    .city(signUpRequest.getCity() != null ? signUpRequest.getCity() : "Unknown")
                    .location(signUpRequest.getLocation() != null ? signUpRequest.getLocation() : "Unknown")
                    .build();

            user = userRepository.save(user);
            log.info("User created successfully with ID: {}", user.getId());

            // 4. Create Wallet
            Wallet wallet = Wallet.builder()
                    .user(user)
                    .balance(BigDecimal.ZERO)
                    .build();
            walletRepository.save(wallet);
            log.info("Wallet created for user ID: {}", user.getId());

            // 5. Create Initial Policy
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
                    .build();

            policyRepository.save(policy);
            log.info("Initial policy created for user ID: {}", user.getId());

            return ResponseEntity.ok(new MessageResponse("User registered successfully with wallet and policy!"));

        } catch (Exception e) {
            log.error("Internal Error during registration for {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Registration failed due to an internal error: " + e.getMessage());
        }
    }
}
