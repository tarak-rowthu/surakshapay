package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Claim;
import com.surakshapay.backend.repositories.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimRepository claimRepository;

    @GetMapping("/policy/{policyId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getClaimsByPolicy(@PathVariable Long policyId) {
        List<Claim> claims = claimRepository.findByPolicyId(policyId);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllClaims() {
        return ResponseEntity.ok(claimRepository.findAll());
    }
}
