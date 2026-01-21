package com.company.management.users.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.company.management.projects.model.Project;
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

    @ManyToMany(mappedBy = "users")
    private Set<Project> projects = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String username, String email, String password, Project project) {
         this.username = username;
         this.email = email;
         this.password = password;
         this.createdAt = LocalDateTime.now();
         this.projects.add(project);
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Set<Project> getProjects() { return projects; }
    public Set<String> getRoles() { return roles; }

    public void addProject(Project project) {
        this.projects.add(project);
        project.getUsers().add(this); 
    }
}
