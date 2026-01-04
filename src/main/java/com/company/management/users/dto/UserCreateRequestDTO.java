package com.company.management.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserCreateRequestDTO {
        @NotBlank
        @Size(min = 3)
        public String username;
        @Email
        @NotBlank
        public String email;
        @NotBlank
        @Size(min = 6)
        public String password;
        @NotBlank
        public Long projectId;
}
