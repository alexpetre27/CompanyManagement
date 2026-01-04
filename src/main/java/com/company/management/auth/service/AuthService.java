package com.company.management.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.management.projects.model.Project;
import com.company.management.users.model.user;
import com.company.management.users.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public user register(String username, String email, String password, Project project) {
        user newUser = new user(username, email, password, project);
        newUser.getCreatedAt();
        return userRepository.save(newUser);
    }
    public boolean login(String username, String password) {
        return userRepository.findByUsername(username)
            .map(user -> user.getPassword().equals(password))
            .orElse(false);
    }
}
