package com.company.management.tasks.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String projectName;
    private boolean isCompleted;
    private String ownerEmail; 

    public Task() {}

    public Task(String title, String projectName, boolean isCompleted, String ownerEmail) {
        this.title = title;
        this.projectName = projectName;
        this.isCompleted = isCompleted;
        this.ownerEmail = ownerEmail;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getProjectName() { return projectName; }
    public boolean getIsCompleted() { return isCompleted; }
    public String getOwnerEmail() { return ownerEmail; }
    
    public void setTitle(String title) { this.title = title; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public void setIsCompleted(boolean isCompleted) { this.isCompleted = isCompleted; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
}