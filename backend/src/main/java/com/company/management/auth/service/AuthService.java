package com.company.management.auth.service;

import com.company.management.auth.dto.AuthDTOs.*; 
import com.company.management.security.JwtUtil;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 

    public AuthService(AuthenticationManager authenticationManager, 
                       JwtUtil jwtUtil, 
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.identifier(),
                        dto.password()
                )
        );

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponseDTO(
            token, 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole(), 
            user.getAvatar()
        );
    }

    public LoginResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole("USER"); 

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponseDTO(
            token, 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole(), 
            user.getAvatar()
        );
    }

    public LoginResponseDTO socialLogin(SocialLoginRequestDTO dto) {
        Optional<User> existingUser = userRepository.findByEmail(dto.email());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            if (dto.avatar() != null && !dto.avatar().equals(user.getAvatar())) {
                user.setAvatar(dto.avatar());
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(dto.email());
            user.setUsername(dto.username() != null ? dto.username() : dto.email().split("@")[0]);
            user.setAvatar(dto.avatar());
            user.setRole("USER");
            
            user.setPassword(passwordEncoder.encode("GOOGLE_AUTH_" + System.currentTimeMillis()));
            
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponseDTO(
            token, 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole(), 
            user.getAvatar()
        );
    }
}