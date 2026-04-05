package com.surakshapay.backend.services;

import org.springframework.stereotype.Service;
import java.util.Random;
import com.surakshapay.backend.models.Payout;

@Service
public class PaymentService {
    private final Random random = new Random();
    
    public void processPayment(Payout payout) {
        System.out.println("Payout Status Before Save: " + payout.getStatus());
        try {
            // Simulate success (hackathon demo)
            payout.setStatus("SUCCESS");
        } catch (Exception e) {
            payout.setStatus("FAILED");
        }

        // Status update is in-memory
        System.out.println("Payout Status After Payment: " + payout.getStatus());
    }

    /**
     * Simulates an external UPI bank transfer.
     * Returns true for SUCCESS, false for FAILED.
     */
    public boolean processPayment(Long userId, double amount) {
        // Simulate network delay
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 80% chance of success
        boolean isSuccess = random.nextInt(100) < 80;
        
        if (isSuccess) {
            System.out.println("UPI Payment SUCCESS for User " + userId + " - Amount: ₹" + amount);
            return true;
        } else {
            System.out.println("UPI Payment FAILED for User " + userId + " - Amount: ₹" + amount + " (Gateway Error)");
            return false;
        }
    }
}
