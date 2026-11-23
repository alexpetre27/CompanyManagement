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

    @Enumerated(EnumType.STRING)
    private TaskDifficulty difficulty;

    public Task() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getProjectName() { return projectName; }
    public boolean getIsCompleted() { return isCompleted; }
    public String getOwnerEmail() { return ownerEmail; }
    public TaskDifficulty getDifficulty() { return difficulty; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public void setIsCompleted(boolean isCompleted) { this.isCompleted = isCompleted; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public void setDifficulty(TaskDifficulty difficulty) { this.difficulty = difficulty; }
}
