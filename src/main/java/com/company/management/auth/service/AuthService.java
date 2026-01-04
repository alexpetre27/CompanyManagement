package com.company.management.auth.service;

import org.springframework.stereotype.Service;

import com.company.management.projects.model.Project;
import com.company.management.users.model.user;
import com.company.management.users.repository.AuthRepository;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    public user register(String username, String email, String password, Project project) {
        user newUser = new user(username, email, password, project);
        newUser.getCreatedAt();
        return authRepository.save(newUser);
    }
    public boolean login(String username, String password) {
        return authRepository.findByUsername(username)
            .map(user -> user.getPassword().equals(password))
            .orElse(false);
    }
}
