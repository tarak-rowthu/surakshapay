package com.surakshapay.backend.services;

import com.surakshapay.backend.models.Alert;
import com.surakshapay.backend.models.User;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AlertService {

    public void generateAlert(Long userId, String type, String message) {
        User user = InMemoryStore.findUserById(userId).orElse(null);
        if (user == null) return;

        Alert alert = Alert.builder()
                .user(user)
                .type(type)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
        InMemoryStore.saveAlert(alert);
    }
}
