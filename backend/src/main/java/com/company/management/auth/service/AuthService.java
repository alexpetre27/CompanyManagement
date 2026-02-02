package com.company.management.auth.service;

import com.company.management.auth.dto.LoginRequestDTO;
import com.company.management.auth.dto.LoginResponseDTO;
import com.company.management.security.JwtUtil;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByUsernameOrEmail(dto.getIdentifier(), dto.getIdentifier())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + dto.getIdentifier()));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(), 
                        dto.getPassword()
                )
        );

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponseDTO(token, user.getUsername(), user.getRole());
    }
}