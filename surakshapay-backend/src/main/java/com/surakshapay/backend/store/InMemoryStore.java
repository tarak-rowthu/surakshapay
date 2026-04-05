package com.surakshapay.backend.store;

import com.surakshapay.backend.models.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryStore {
    private static final PasswordEncoder encoder = new BCryptPasswordEncoder();
    
    public static List<User> users = new ArrayList<>();
    public static List<Wallet> wallets = new ArrayList<>();
    public static List<Policy> policies = new ArrayList<>();
    public static List<Payout> payouts = new ArrayList<>();
    public static List<Alert> alerts = new ArrayList<>();
    public static List<Transaction> transactions = new ArrayList<>();
    public static List<Claim> claims = new ArrayList<>();

    static {
        // Initial Dummy Data
        User user1 = User.builder()
                .id(1L)
                .name("Tarak Rowthu")
                .email("test@example.com")
                .password(encoder.encode("password"))
                .role(Role.USER)
                .city("Hyderabad")
                .location("Madhapur")
                .build();

        User admin = User.builder()
                .id(2L)
                .name("Admin")
                .email("admin@surakshapay.com")
                .password(encoder.encode("admin123"))
                .role(Role.ADMIN)
                .city("Bangalore")
                .location("Indiranagar")
                .build();

        users.add(user1);
        users.add(admin);

        Wallet wallet1 = Wallet.builder()
                .id(1L)
                .user(user1)
                .balance(new BigDecimal("5000.00"))
                .build();
        wallets.add(wallet1);

        Policy policy1 = Policy.builder()
                .id(1L)
                .user(user1)
                .planType("Pro")
                .premium(new BigDecimal("60.00"))
                .coverage(new BigDecimal("50000.00"))
                .status(PolicyStatus.ACTIVE)
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(20))
                .build();
        policies.add(policy1);

        // Standard Alerts
        alerts.add(Alert.builder()
                .id(1L)
                .user(user1)
                .type("SUCCESS")
                .message("Welcome to SurakshaPay! Your account is secured.")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build());
    }

    // Helper Methods
    public static Optional<User> findUserByEmail(String email) {
        return users.stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    public static Optional<User> findUserById(Long id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public static Optional<Wallet> findWalletByUserId(Long userId) {
        return wallets.stream().filter(w -> w.getUser().getId().equals(userId)).findFirst();
    }

    public static List<Policy> findPoliciesByUserId(Long userId) {
        return policies.stream().filter(p -> p.getUser().getId().equals(userId)).collect(Collectors.toList());
    }

    public static List<Payout> findPayoutsByUserId(Long userId) {
        return payouts.stream().filter(p -> p.getUser().getId().equals(userId)).collect(Collectors.toList());
    }

    public static List<Alert> findAlertsByUserId(Long userId) {
        return alerts.stream().filter(a -> a.getUser().getId().equals(userId))
                .sorted((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public static User saveUser(User user) {
        if (user.getId() == null) {
            user.setId((long) (users.size() + 1));
        }
        users.add(user);
        return user;
    }

    public static Wallet saveWallet(Wallet wallet) {
        if (wallet.getId() == null) {
            wallet.setId((long) (wallets.size() + 1));
        }
        wallets.add(wallet);
        return wallet;
    }

    public static Policy savePolicy(Policy policy) {
        if (policy.getId() == null) {
            policy.setId((long) (policies.size() + 1));
        }
        policies.add(policy);
        return policy;
    }

    public static Payout savePayout(Payout payout) {
        if (payout.getId() == null) {
            payout.setId((long) (payouts.size() + 1));
        }
        payouts.add(payout);
        return payout;
    }

    public static Alert saveAlert(Alert alert) {
        if (alert.getId() == null) {
            alert.setId((long) (alerts.size() + 1));
        }
        alerts.add(alert);
        return alert;
    }

    public static List<Transaction> findTransactionsByUserId(Long userId) {
        return transactions.stream()
                .filter(t -> t.getUser().getId().equals(userId))
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public static Transaction saveTransaction(Transaction transaction) {
        if (transaction.getId() == null) {
            transaction.setId((long) (transactions.size() + 1));
        }
        transactions.add(transaction);
        return transaction;
    }

    public static List<Claim> findClaimsByPolicyId(Long policyId) {
        return claims.stream()
                .filter(c -> c.getPolicy().getId().equals(policyId))
                .collect(Collectors.toList());
    }

    public static List<Claim> findAllClaims() {
        return claims;
    }

    public static Claim saveClaim(Claim claim) {
        if (claim.getId() == null) {
            claim.setId((long) (claims.size() + 1));
        }
        claims.add(claim);
        return claim;
    }
}
