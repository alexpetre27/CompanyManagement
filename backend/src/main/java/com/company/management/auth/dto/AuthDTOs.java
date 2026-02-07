package com.company.management.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDTOs {

    public record LoginRequestDTO(
        @NotBlank(message = "Email or Username is required")
        String identifier,

        @NotBlank(message = "Password is required")
        String password
    ) {}

    public record LoginResponseDTO(
        String token,
        String username,
        String role
    ) {}
}