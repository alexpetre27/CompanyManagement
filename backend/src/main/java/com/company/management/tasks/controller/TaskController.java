package com.company.management.tasks.controller;

import com.company.management.tasks.dto.TaskDTOs.CreateTaskDTO;
import com.company.management.tasks.dto.TaskDTOs.TaskResponseDTO;
import com.company.management.tasks.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getMyTasks(Authentication auth) {
        return ResponseEntity.ok(taskService.getMyTasks(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody CreateTaskDTO dto, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(dto, auth.getName()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskResponseDTO> toggleTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggleTaskStatus(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}