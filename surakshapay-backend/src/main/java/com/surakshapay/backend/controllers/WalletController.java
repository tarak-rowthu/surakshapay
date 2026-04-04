package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.*;
import com.surakshapay.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class WalletController {

    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PayoutRepository payoutRepository;

    @GetMapping("/payouts/trend/{userId}")
    public ResponseEntity<?> getPayoutTrend(@PathVariable Long userId) {
        List<Object[]> rows = payoutRepository.getDailyPayouts(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("day", row[0].toString());
            map.put("amount", ((Number) row[1]).doubleValue());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/wallet/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
        if (walletOpt.isPresent()) return ResponseEntity.ok(walletOpt.get());

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Wallet w = Wallet.builder().user(userOpt.get()).balance(BigDecimal.ZERO).build();
            walletRepository.save(w);
            return ResponseEntity.ok(w);
        }
        return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionRepository.findByUser_IdOrderByCreatedAtDesc(userId));
    }

    @PostMapping("/wallet/add")
    public ResponseEntity<?> addFunds(@RequestBody Map<String, Object> req) {
        Long userId = ((Number) req.get("userId")).longValue();
        BigDecimal amount = new BigDecimal(req.get("amount").toString());
        Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
        if (!walletOpt.isPresent()) return ResponseEntity.badRequest().build();
        Wallet w = walletOpt.get();
        w.setBalance(w.getBalance().add(amount));
        walletRepository.save(w);
        
        Transaction t = Transaction.builder()
            .user(w.getUser()).amount(amount).type("CREDIT")
            .description("Manual Top-up via UI").createdAt(LocalDateTime.now()).build();
        transactionRepository.save(t);
        return ResponseEntity.ok(w);
    }
}
