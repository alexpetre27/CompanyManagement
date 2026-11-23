package com.company.management.tasks.dto;

import com.company.management.tasks.model.TaskDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TaskDTOs {

    public record TaskResponseDTO(
            Long id,
            String title,
            String projectName,
            boolean isCompleted,
            TaskDifficulty difficulty
    ) {}

    public record CreateTaskDTO(
            @NotBlank(message = "Title is required")
            @Size(max = 200, message = "Title must be at most 200 characters")
            String title,

            @NotNull(message = "Project is required")
            Long projectId,

            TaskDifficulty difficulty,

            /* Only honoured for administrators; everyone else always creates tasks for themselves. */
            Long assigneeId
    ) {}
}
