package com.company.management.users.model;
import java.time.LocalDateTime;

import com.company.management.projects.model.Project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class user {
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
    @ManyToOne
    private Project project;
    public user() {
    }
    public user(String username, String email, String password, Project project) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.project = project;
    }
    public Long getId(){
        return id;
    }
    public String getUsername(){
        return username;
    }

    public String getEmail(){
        return email;
    }
    public String getPassword(){
        return password;
    }
    public Project getProject(){
        return project;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public void setProject(Project project){
        this.project = project;
    }
    public void setUsername(String username){
        this.username = username;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setPassword(String password){
        this.password = password;
    }
  
}
