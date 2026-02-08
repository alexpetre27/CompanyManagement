package com.company.management.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDTOs {

    public record LoginRequestDTO(
        @NotBlank(message = "Email or Username is required")
        String identifier,

        @NotBlank(message = "Password is required")
        String password
    ) {}
    public record RegisterRequestDTO(String username, String email, String password) {}

    public record SocialLoginRequestDTO(String email, String username, String avatar) {}
public record LoginResponseDTO(
        String token, 
        String username, 
        String email, 
        String role,
        String avatar
    ) {}
}