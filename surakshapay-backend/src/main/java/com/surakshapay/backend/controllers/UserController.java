package com.surakshapay.backend.controllers;

import com.surakshapay.backend.models.User;
import com.surakshapay.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        if (request.containsKey("name")) user.setName((String) request.get("name"));
        if (request.containsKey("email")) user.setEmail((String) request.get("email"));
        if (request.containsKey("city")) user.setCity((String) request.get("city"));
        if (request.containsKey("location")) user.setLocation((String) request.get("location"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }
}
