package com.surakshapay.backend.repositories;

import com.surakshapay.backend.models.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByUser_Id(Long userId);
    List<Policy> findByStatus(com.surakshapay.backend.models.PolicyStatus status);
    List<Policy> findByUser_IdAndStatus(Long userId, com.surakshapay.backend.models.PolicyStatus status);
}
