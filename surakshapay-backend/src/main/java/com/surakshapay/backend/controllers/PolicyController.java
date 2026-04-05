package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Policy;
import com.surakshapay.backend.models.PolicyStatus;
import com.surakshapay.backend.models.User;
import com.surakshapay.backend.services.AiRiskEngineService;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private AiRiskEngineService aiRiskEngineService;

    @GetMapping("/plans")
    public ResponseEntity<?> getPlans() {
        return ResponseEntity.ok(availablePlans);
    }
    
    @PostMapping("/quote")
    public ResponseEntity<?> getQuote(@RequestBody Map<String, Object> request) {
        com.surakshapay.backend.services.RiskResult result = aiRiskEngineService.calculateRisk();
        return ResponseEntity.ok(Map.of("riskScore", result.getRiskScore()));
    }

    @PostMapping({"/create", "/activate"})
    public ResponseEntity<?> createPolicy(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Optional<User> userOpt = InMemoryStore.findUserById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            User user = userOpt.get();

            String planType = (String) request.getOrDefault("planType", "Basic");
            
            PolicyPlan selectedPlan = availablePlans.stream()
                    .filter(p -> p.getPlanType().equalsIgnoreCase(planType))
                    .findFirst()
                    .orElse(availablePlans.get(0));

            // Deactivate existing
            InMemoryStore.findPoliciesByUserId(userId).forEach(p -> p.setStatus(PolicyStatus.INACTIVE));

            Policy policy = Policy.builder()
                    .user(user)
                    .planType(planType)
                    .premium(selectedPlan.getPremium())
                    .coverage(selectedPlan.getCoverage())
                    .status(PolicyStatus.ACTIVE)
                    .startDate(LocalDateTime.now())
                    .endDate(LocalDateTime.now().plusDays(7))
                    .createdAt(LocalDateTime.now())
                    .build();

            InMemoryStore.savePolicy(policy);
            return ResponseEntity.ok(policy);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating policy");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getPolicy(@RequestParam Long userId) {
        return ResponseEntity.ok(InMemoryStore.findPoliciesByUserId(userId));
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActivePolicy(@RequestParam Long userId) {
        return ResponseEntity.ok(InMemoryStore.findPoliciesByUserId(userId).stream()
                .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                .findFirst()
                .orElse(null));
    }
}
