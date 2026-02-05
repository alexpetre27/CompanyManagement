package com.company.management.projects.dto;

public class ProjectMemberDTO {
    public String id;
    public String name;
    public String role;
    public String avatar;

    public ProjectMemberDTO(String id, String name, String role, String avatar) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
    }
}