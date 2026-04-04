package com.surakshapay.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @GetMapping
    public ResponseEntity<?> getLocations() {
        return ResponseEntity.ok(Map.of(
            "Chennai", List.of("Velachery", "T Nagar", "Anna Nagar", "Adyar", "OMR"),
            "Bangalore", List.of("Koramangala", "Indiranagar", "Whitefield", "BTM Layout", "Electronic City"),
            "Hyderabad", List.of("Madhapur", "Gachibowli", "Hitech City", "Banjara Hills", "Kukatpally")
        ));
    }
}
