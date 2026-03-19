package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.PolicyStatus;
import com.surakshapay.backend.models.User;
import com.surakshapay.backend.repositories.PolicyRepository;
import com.surakshapay.backend.repositories.UserRepository;
import com.surakshapay.backend.services.AiRiskEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    // Get policy risk quote without purchasing
    @PostMapping("/quote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getQuote(@RequestBody Map<String, Object> request) {
        String location = (String) request.getOrDefault("location", "Bangalore");
        int expectedHours = (int) request.getOrDefault("expectedHours", 40);
        
        AiRiskEngineService.RiskAssessment assessment = aiRiskEngineService.calculateRisk(location, expectedHours);
        return ResponseEntity.ok(assessment);
    }

    // Purchase a policy
    @PostMapping("/purchase")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> purchasePolicy(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        String location = (String) request.getOrDefault("location", "Bangalore");
        int expectedHours = (int) request.getOrDefault("expectedHours", 40);

        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();

        AiRiskEngineService.RiskAssessment assessment = aiRiskEngineService.calculateRisk(location, expectedHours);

        Policy policy = Policy.builder()
                .user(user)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(7)) // 1 week policy
                .weeklyPremium(assessment.weeklyPremium)
                .protectedEarnings(assessment.protectedEarnings)
                .riskScore(assessment.riskScore)
                .status(PolicyStatus.ACTIVE)
                .build();

        policyRepository.save(policy);
        return ResponseEntity.ok(policy);
    }

    // Get user's policies
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserPolicies(@PathVariable Long userId) {
        List<Policy> policies = policyRepository.findByUserId(userId);
        return ResponseEntity.ok(policies);
    }
}
