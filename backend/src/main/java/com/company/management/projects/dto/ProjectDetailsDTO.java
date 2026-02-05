package com.company.management.projects.dto;

import java.util.List;

public class ProjectDetailsDTO {
    public Long id;
    public String name;
    public String description;
    public String status;
    public String version;
    public String updatedAt;
    public int teamCount;
    public List<String> techStack;
    public List<ProjectMemberDTO> team;
    public String repoUrl;
    public String liveUrl;

    public ProjectDetailsDTO() {}
    public ProjectDetailsDTO(Long id, String name, String description, String status, String version,
                             String updatedAt, int teamCount, List<String> techStack,
                             List<ProjectMemberDTO> team, String repoUrl, String liveUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.version = version;
        this.updatedAt = updatedAt;
        this.teamCount = teamCount;
        this.techStack = techStack;
        this.team = team;
        this.repoUrl = repoUrl;
        this.liveUrl = liveUrl;
    }
}