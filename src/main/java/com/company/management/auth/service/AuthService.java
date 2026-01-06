package com.company.management.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.management.auth.dto.LoginRequestDTO;
import com.company.management.auth.dto.LoginResponseDTO;
import com.company.management.users.model.user;
import com.company.management.users.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        user user = userRepository.findByEmail(dto.email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.id = user.getId();
        response.username = user.getUsername();
        response.email = user.getEmail();
        response.projectId = user.getProject().getId();

        return response;
    }
}
