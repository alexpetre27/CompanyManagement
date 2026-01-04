package com.company.management.auth.dto;

import com.company.management.projects.model.Project;

public class AuthRequestDTO {
    private String username;
    private String password;
    private String email;
    private Project project;
    public AuthRequestDTO() {
    }
    public AuthRequestDTO(String username, String password, String email, Project project) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.project = project;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Project getProject() {
        return project;
        }   
    public void setProject(Project project) {
        this.project = project; 
    }
}