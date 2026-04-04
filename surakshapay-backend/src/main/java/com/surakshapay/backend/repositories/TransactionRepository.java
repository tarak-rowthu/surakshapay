package com.surakshapay.backend.repositories;
import com.surakshapay.backend.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
