package com.company.management.auth.dto;


import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {
    @NotBlank
    public String username;
    @NotBlank
    public String password;
    @NotBlank
    public String role;
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getUsername() {
        return username;}

    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
