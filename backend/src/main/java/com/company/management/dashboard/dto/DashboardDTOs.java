package com.company.management.dashboard.dto;

import java.util.List;

public class DashboardDTOs {

    public record DashboardData(
        UserSummaryDTO user,
        StatsDTO stats,
        List<ProjectSummaryDTO> recentProjects,
        List<TaskSummaryDTO> todayTasks
    ) {}

    public record UserSummaryDTO(
        String name,
        String email,
        String image
    ) {}

    public record StatsDTO(
        int activeProjects,
        int teamMembers,
        int hoursWorked,
        int productivity
    ) {}

    public record ProjectSummaryDTO(
        String id,
        String name,
        String version,
        String updatedAt,
        String status, 
        int teamCount
    ) {}

    public record TaskSummaryDTO(
        String id,
        String title,
        String projectName,
        boolean isCompleted
    ) {}
}