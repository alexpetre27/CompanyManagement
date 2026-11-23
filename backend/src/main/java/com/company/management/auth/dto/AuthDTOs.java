package com.company.management.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTOs {

    public record LoginRequestDTO(
            @NotBlank(message = "Email or Username is required")
            String identifier,

            @NotBlank(message = "Password is required")
            String password
    ) {}

    public record SocialLoginRequestDTO(
            @NotBlank @Email String email,
            @Size(max = 100) String username,
            @Size(max = 1000) String avatar
    ) {}

    public record LoginResponseDTO(
            String token,
            long expiresInMs,
            String username,
            String email,
            String role,
            String avatar
    ) {}
}
