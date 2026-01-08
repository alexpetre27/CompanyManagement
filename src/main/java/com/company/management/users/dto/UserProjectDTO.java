package com.company.management.users.dto;

public class UserProjectDTO {
    public Long userId;
    public Long projectId;

    public UserProjectDTO() {
    }
    public UserProjectDTO(Long userId, Long projectId) {
        this.userId = userId;
        this.projectId = projectId;
    }
}  
