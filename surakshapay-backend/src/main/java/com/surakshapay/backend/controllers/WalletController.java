package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class WalletController {

    @GetMapping("/wallet/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        Optional<Wallet> walletOpt = InMemoryStore.findWalletByUserId(userId);
        if (walletOpt.isPresent()) return ResponseEntity.ok(walletOpt.get());

        Optional<User> userOpt = InMemoryStore.findUserById(userId);
        if (userOpt.isPresent()) {
            Wallet w = Wallet.builder().user(userOpt.get()).balance(BigDecimal.ZERO).build();
            InMemoryStore.saveWallet(w);
            return ResponseEntity.ok(w);
        }
        return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(InMemoryStore.findTransactionsByUserId(userId));
    }

    @PostMapping("/wallet/add")
    public ResponseEntity<?> addFunds(@RequestBody Map<String, Object> req) {
        try {
            Long userId = ((Number) req.get("userId")).longValue();
            BigDecimal amount = new BigDecimal(req.get("amount").toString());
            Optional<Wallet> walletOpt = InMemoryStore.findWalletByUserId(userId);
            if (!walletOpt.isPresent()) return ResponseEntity.badRequest().build();
            
            Wallet w = walletOpt.get();
            w.setBalance(w.getBalance().add(amount));
            
            Transaction t = Transaction.builder()
                .user(w.getUser())
                .amount(amount)
                .type("CREDIT")
                .description("Manual Top-up via UI")
                .createdAt(LocalDateTime.now())
                .build();
            InMemoryStore.saveTransaction(t);
            return ResponseEntity.ok(w);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding funds");
        }
    }
}
