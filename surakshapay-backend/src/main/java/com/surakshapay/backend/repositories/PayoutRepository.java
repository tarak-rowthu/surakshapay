package com.surakshapay.backend.repositories;

import com.surakshapay.backend.models.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {

    List<Payout> findByUserId(Long userId);

    List<Payout> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Anti-abuse: check if a payout exists for this user+triggerType in the recent window
    boolean existsByUserIdAndTriggerTypeAndCreatedAtAfter(Long userId, String triggerType, LocalDateTime since);

    // Anti-abuse: check if any payout exists for this user in the recent window
    boolean existsByUserIdAndCreatedAtAfter(Long userId, LocalDateTime since);

    // Anti-abuse: count recent payouts for rate limiting (single canonical Spring Data JPA method)
    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime since);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.user.id = :userId AND p.status = 'SUCCESS'")
    Double sumTotalAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.user.id = :userId AND p.createdAt >= :since")
    Double sumAmountByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT p.createdAt as pDate, SUM(p.amount) as pSum FROM Payout p WHERE p.user.id = :userId AND p.status = 'SUCCESS' GROUP BY p.createdAt ORDER BY p.createdAt ASC")
    List<Object[]> findPayoutTrendsByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.user.id = :userId AND p.status = 'SUCCESS'")
    Double getTotalPayoutByUserId(@Param("userId") Long userId);

    @Query("SELECT DATE(p.createdAt), SUM(p.amount) FROM Payout p WHERE p.user.id = :userId GROUP BY DATE(p.createdAt)")
    List<Object[]> getDailyPayouts(@Param("userId") Long userId);
}
