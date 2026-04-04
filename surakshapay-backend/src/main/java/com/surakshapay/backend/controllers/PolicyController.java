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
import java.math.BigDecimal;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.surakshapay.backend.dto.PolicyPlan;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/policy")
public class PolicyController {

    private final List<PolicyPlan> availablePlans = List.of(
            new PolicyPlan("Basic", BigDecimal.valueOf(5), BigDecimal.valueOf(2000)),
            new PolicyPlan("Standard", BigDecimal.valueOf(15), BigDecimal.valueOf(10000)),
            new PolicyPlan("Plus", BigDecimal.valueOf(25), BigDecimal.valueOf(25000)),
            new PolicyPlan("Premium", BigDecimal.valueOf(50), BigDecimal.valueOf(50000))
    );

    @GetMapping("/plans")
    public ResponseEntity<?> getPlans() {
        return ResponseEntity.ok(availablePlans);
    }
    
    public double calculatePremium(String city, double temperature, double rainfall) {
        double base = 10;
        
        if (temperature > 40) base += 5;
        if (temperature > 45) base += 10;
        
        if (rainfall > 50) base += 5;
        if (rainfall > 100) base += 10;
        
        if (city != null && city.equalsIgnoreCase("Chennai")) base += 5;
        if (city != null && city.equalsIgnoreCase("Mumbai")) base += 7;
        
        return base;
    }

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
        com.surakshapay.backend.services.RiskResult result = aiRiskEngineService.calculateRisk();
        double riskScore = result.getRiskScore();
        return ResponseEntity.ok(Map.of("riskScore", riskScore));
    }

    // Purchase a policy
    @PostMapping({"/create", "/activate"})
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPolicy(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String location = (String) request.getOrDefault("location", "Bangalore");
        int expectedHours = (int) request.getOrDefault("expectedHours", 40);

        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();

        String planType = (String) request.getOrDefault("planType", "Basic");
        String city = (String) request.getOrDefault("city", location);
        
        // Mock realtime weather for dynamic calculation
        double currentTemp = 35 + new java.util.Random().nextDouble() * 15; // 35 to 50
        double currentRain = new java.util.Random().nextDouble() * 120; // 0 to 120

        double dynamicPremiumVal = calculatePremium(city, currentTemp, currentRain);
        BigDecimal premium = BigDecimal.valueOf(dynamicPremiumVal);

        PolicyPlan selectedPlan = availablePlans.stream()
                .filter(p -> p.getPlanType().equalsIgnoreCase(planType))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid Plan"));

        BigDecimal coverage = selectedPlan.getCoverage();

        // Enforce Singleton Active Policy Check: Set all existing active policies to INACTIVE
        List<Policy> existingActivePolicies = policyRepository.findByUser_IdAndStatus(userId, PolicyStatus.ACTIVE);
        for (Policy existingPolicy : existingActivePolicies) {
            existingPolicy.setStatus(PolicyStatus.INACTIVE);
            policyRepository.save(existingPolicy);
        }

        Policy policy = Policy.builder()
                .user(user)
                .planType(planType)
                .premium(premium)
                .coverage(coverage)
                .status(PolicyStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(7))
                .build();

        policyRepository.save(policy);
        return ResponseEntity.ok(policy);
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getPolicy(@RequestParam Long userId) {
        List<Policy> policies = policyRepository.findByUser_Id(userId);
        return ResponseEntity.ok(policies);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getActivePolicy(@RequestParam Long userId) {
        List<Policy> policies = policyRepository.findByUser_IdAndStatus(userId, PolicyStatus.ACTIVE);
        if (policies.isEmpty()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok(policies.get(0));
    }
}
