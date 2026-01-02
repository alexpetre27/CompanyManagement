package com.company.management.auth.service;

import org.springframework.stereotype.Service;

import com.company.management.auth.model.User;
import com.company.management.auth.repository.AuthRepository;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    public User register(String username, String email, String password) {
        User newUser = new User(username, email, password);
        newUser.getCreatedAt();
        return authRepository.save(newUser);
    }
    public boolean login(String username, String password) {
        return authRepository.findByUsername(username)
            .map(user -> user.getPassword().equals(password))
            .orElse(false);
    }
}
