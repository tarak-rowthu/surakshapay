package com.surakshapay.backend.repositories;

import com.surakshapay.backend.models.Disruption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DisruptionRepository extends JpaRepository<Disruption, Long> {
    List<Disruption> findByTimestampAfter(LocalDateTime timestamp);
}
