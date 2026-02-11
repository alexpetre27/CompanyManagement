package com.company.management.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTOs {
public record UserResponseDTO(
        Long id,
        String username,
        String email,
        String role,
        String avatar,
        Boolean notificationsEnabled,
        String themePreference,
        Long projectId
    ) {}
    public record ChangePasswordDTO(
        String oldPassword,
        String newPassword
    ) {}

    public record UserPreferencesDTO(
        Boolean notificationsEnabled,
        String themePreference
    ) {}
    public record UserUpdateRequestDTO(
        String username,
        String email
    ) {}
    public record UserCreateRequestDTO(
        @NotBlank(message = "Username is required")
        @Size(min = 3, message = "Username must be at least 3 characters")
        String username,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,
        
        String role,   
        String avatar  
    ) {}
}