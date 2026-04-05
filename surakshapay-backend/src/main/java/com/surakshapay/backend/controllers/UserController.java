package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.User;
import com.surakshapay.backend.store.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> request) {
        try {
            Long userId = ((Number) request.get("userId")).longValue();
            Optional<User> userOpt = InMemoryStore.findUserById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }
            User user = userOpt.get();
            if (request.containsKey("name")) user.setName((String) request.get("name"));
            if (request.containsKey("email")) user.setEmail((String) request.get("email"));
            if (request.containsKey("city")) user.setCity((String) request.get("city"));
            if (request.containsKey("location")) user.setLocation((String) request.get("location"));
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating profile");
        }
    }
}
