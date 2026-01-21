package com.company.management.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.management.auth.dto.LoginRequestDTO;
import com.company.management.auth.dto.LoginResponseDTO;
import com.company.management.security.JwtUtil;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.id = user.getId();
        response.username = user.getUsername();
        response.email = user.getEmail();
        response.token = jwtUtil.generateToken(user.getUsername()) ;

        return response;
    }
}
