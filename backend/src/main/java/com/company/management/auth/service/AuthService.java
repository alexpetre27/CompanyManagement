package com.company.management.auth.service;

import com.company.management.auth.dto.AuthDTOs.LoginRequestDTO;
import com.company.management.auth.dto.AuthDTOs.LoginResponseDTO;
import com.company.management.auth.dto.AuthDTOs.SocialLoginRequestDTO;
import com.company.management.security.JwtUtil;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Locale;

@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

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
                new UsernamePasswordAuthenticationToken(dto.identifier(), dto.password()));

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        return toResponse(user);
    }

    /** Caller (AuthController) has already verified that the request comes from the trusted frontend. */
    @Transactional
    public LoginResponseDTO socialLogin(SocialLoginRequestDTO dto) {
        String email = dto.email().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailIgnoreCase(email)
                .map(existing -> {
                    if (dto.avatar() != null && !dto.avatar().equals(existing.getAvatar())) {
                        existing.setAvatar(dto.avatar());
                    }
                    return existing;
                })
                .orElseGet(() -> createSocialUser(email, dto));

        return toResponse(userRepository.save(user));
    }

    private User createSocialUser(String email, SocialLoginRequestDTO dto) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(uniqueUsername(dto.username() != null && !dto.username().isBlank()
                ? dto.username()
                : email.substring(0, email.indexOf('@'))));
        user.setAvatar(dto.avatar());
        user.setRole("USER");
        // Social accounts never log in with a password; store an unguessable random one.
        byte[] randomPassword = new byte[32];
        RANDOM.nextBytes(randomPassword);
        user.setPassword(passwordEncoder.encode(Base64.getEncoder().encodeToString(randomPassword)));
        return user;
    }

    /** Google display names may contain spaces or collide with existing usernames. */
    private String uniqueUsername(String desired) {
        String base = desired.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]+", "_");
        if (base.length() < 3) base = "user_" + base;
        if (base.length() > 40) base = base.substring(0, 40);
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + "_" + suffix++;
        }
        return candidate;
    }

    private LoginResponseDTO toResponse(User user) {
        return new LoginResponseDTO(
                jwtUtil.generateToken(user.getId()),
                jwtUtil.getExpirationMs(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar()
        );
    }
}
