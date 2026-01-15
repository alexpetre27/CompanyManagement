package com.company.management.users.dto;

public class UserProjectDTO {
    public Long userId;
    public Long projectId;
    public String projectName;
    public UserProjectDTO() {
    }
    public UserProjectDTO(Long userId, Long projectId, String projectName) {
        this.userId = userId;
        this.projectId = projectId;
        this.projectName = projectName;
    }
}  
