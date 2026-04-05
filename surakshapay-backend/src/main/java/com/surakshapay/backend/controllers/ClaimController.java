package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.Claim;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @GetMapping("/policy/{policyId}")
    public ResponseEntity<?> getClaimsByPolicy(@PathVariable Long policyId) {
        List<Claim> claims = InMemoryStore.findClaimsByPolicyId(policyId);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllClaims() {
        return ResponseEntity.ok(InMemoryStore.findAllClaims());
    }
}
