package com.company.management.auth.dto;

public class LoginResponseDTO {
    private String token;
    private String username;
    private String role; 

    public LoginResponseDTO(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}