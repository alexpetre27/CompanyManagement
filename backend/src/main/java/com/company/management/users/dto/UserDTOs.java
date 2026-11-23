package com.company.management.users.dto;

import com.company.management.users.model.ProjectRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
            Long projectId,
            String projectName,
            ProjectRole projectRole
    ) {}

    public record ChangePasswordDTO(
            @NotBlank(message = "Current password is required")
            String oldPassword,

            @NotBlank(message = "New password is required")
            @Size(min = 6, max = 100, message = "New password must be between 6 and 100 characters")
            String newPassword
    ) {}

    public record UserPreferencesDTO(
            Boolean notificationsEnabled,

            @Pattern(regexp = "LIGHT|DARK", message = "Theme must be LIGHT or DARK")
            String themePreference
    ) {}

    /** Both fields are optional; blank values are ignored. */
    public record UserUpdateRequestDTO(
            @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
            @Pattern(regexp = "^[A-Za-z0-9._ -]*$", message = "Username contains invalid characters")
            String username,

            @Email(message = "Invalid email format")
            @Size(max = 100)
            String email
    ) {}

    public record UserCreateRequestDTO(
            @NotBlank(message = "Username is required")
            @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
            @Pattern(regexp = "^[A-Za-z0-9._ -]+$", message = "Username contains invalid characters")
            String username,

            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            @Size(max = 100)
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
            String password
    ) {}

    public record AssignUserRequestDTO(
            @NotNull(message = "projectId is required")
            Long projectId,

            ProjectRole projectRole
    ) {}
}
