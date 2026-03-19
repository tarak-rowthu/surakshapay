package com.surakshapay.backend.repositories;

import com.surakshapay.backend.models.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByPolicyId(Long policyId);
    List<Claim> findByStatus(com.surakshapay.backend.models.ClaimStatus status);
}
