package com.company.management.tasks.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskDTOs {
    public record TaskResponseDTO(
        Long id,
        String title,
        String projectName,
        boolean isCompleted
    ) {}

    public record CreateTaskDTO(
        @NotBlank String title,
        @NotBlank String projectName
    ) {}
}