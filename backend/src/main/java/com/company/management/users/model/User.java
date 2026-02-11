package com.company.management.users.model;

import com.company.management.projects.model.Microservice;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String role; 

    @Column(nullable = true)
    private String avatar;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    @Column(name = "theme_preference")
    private String themePreference = "LIGHT";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "microservice_id")
    private Microservice project;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.role = "USER"; 
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean n) { this.notificationsEnabled = n; }
    public String getThemePreference() { return themePreference; }
    public void setThemePreference(String t) { this.themePreference = t; }
    public Microservice getProject() { return project; }
    public void setProject(Microservice project) { this.project = project; }
}