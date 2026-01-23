package com.company.management.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank(message = "Username-ul este obligatoriu")
    @Size(min = 3, max = 20, message = "Username-ul trebuie să aibă între 3 și 20 de caractere")
    private String username;

    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Email-ul trebuie să fie valid")
    private String email;

    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 6, message = "Parola trebuie să aibă cel puțin 6 caractere")
    private String password;
    private String role;

    public RegisterRequestDTO() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}