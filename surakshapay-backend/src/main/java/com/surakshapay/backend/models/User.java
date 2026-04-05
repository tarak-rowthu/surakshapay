package com.surakshapay.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String city;
    private String location;
    private LocalDateTime createdAt;

    @JsonManagedReference
    @Builder.Default
    private List<Policy> policies = new ArrayList<>();
}
