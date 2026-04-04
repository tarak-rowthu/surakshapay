package com.surakshapay.backend.repositories;

import com.surakshapay.backend.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
