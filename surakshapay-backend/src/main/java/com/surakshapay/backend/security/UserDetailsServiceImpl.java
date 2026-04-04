package com.surakshapay.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Dummy user (no database required)
        return org.springframework.security.core.userdetails.User
                .withUsername("test")
                .password("{noop}password")
                .roles("USER")
                .build();
    }
}