package com.surakshapay.backend.services;

import com.surakshapay.backend.models.Alert;
import com.surakshapay.backend.repositories.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public void generateAlert(Long userId, String type, String message) {
        Alert alert = Alert.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
        alertRepository.save(alert);
    }
}
