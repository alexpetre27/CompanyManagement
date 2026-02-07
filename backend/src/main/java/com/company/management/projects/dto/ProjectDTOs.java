package com.company.management.projects.dto;

import java.util.List;

public class ProjectDTOs {

    public record ProjectDetailsDTO(
        Long id,
        String name,
        String description,
        String status,
        String version,
        String updatedAt, 
        int teamCount,
        List<String> techStack,
        List<ProjectMemberDTO> team,
        String repoUrl,
        String liveUrl
    ) {}

    public record CreateProjectDTO(
        String name,
        String version,
        Integer port,
        String description,
        String repoUrl,
        String liveUrl,
        List<String> techStack,
        List<String> teamMembers
    ) {}

    public record ProjectMemberDTO(
        String id,
        String name,
        String role,
        String avatar
    ) {}
}