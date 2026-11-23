package com.company.management.projects.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ProjectDTOs {

    /** Used by list views; never exposes user entities. */
    public record ProjectSummaryDTO(
            Long id,
            String name,
            String description,
            String status,
            String version,
            Integer port,
            String uptime,
            String updatedAt,
            int teamCount,
            List<String> techStack,
            String repoUrl,
            String liveUrl
    ) {}

    public record ProjectDetailsDTO(
            Long id,
            String name,
            String description,
            String status,
            String version,
            Integer port,
            String updatedAt,
            int teamCount,
            List<String> techStack,
            List<ProjectMemberDTO> team,
            String repoUrl,
            String liveUrl
    ) {}

    public record CreateProjectDTO(
            @NotBlank(message = "Project name is required")
            @Size(max = 100)
            String name,

            @Size(max = 30)
            String version,

            @Min(value = 1, message = "Port must be between 1 and 65535")
            @Max(value = 65535, message = "Port must be between 1 and 65535")
            Integer port,

            @Size(max = 2000)
            String description,

            @Size(max = 500)
            @Pattern(regexp = "^$|^https?://.*", message = "Repository URL must start with http:// or https://")
            String repoUrl,

            @Size(max = 500)
            @Pattern(regexp = "^$|^https?://.*", message = "Live URL must start with http:// or https://")
            String liveUrl,

            @Size(max = 20)
            List<@NotBlank @Size(max = 50) String> techStack,

            /* Usernames of the members to assign to the new project. */
            List<String> teamMembers
    ) {}

    public record ProjectMemberDTO(
            String id,
            String name,
            String role,
            String avatar
    ) {}
}
