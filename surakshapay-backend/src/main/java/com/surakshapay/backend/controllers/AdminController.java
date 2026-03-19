package com.surakshapay.backend.controllers;

import com.surakshapay.backend.services.ParametricTriggerService;
import com.surakshapay.backend.repositories.PolicyRepository;
import com.surakshapay.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ParametricTriggerService parametricTriggerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPolicies", policyRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/simulate-trigger")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> simulateTrigger(@RequestBody Map<String, String> request) {
        String location = request.getOrDefault("location", "Bangalore");
        String eventType = request.getOrDefault("eventType", "RAINFALL");
        String severity = request.getOrDefault("severity", "HIGH");

        parametricTriggerService.simulateWeatherEvent(location, eventType, severity);

        return ResponseEntity.ok("Simulated " + eventType + " (" + severity + ") in " + location + ". Auto-payouts generated for affected active policies.");
    }
}
