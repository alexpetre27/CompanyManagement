package com.company.management.tasks.service;
import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.tasks.dto.TaskDTOs.*;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponseDTO> getMyTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return taskRepository.findByOwnerEmail(user.getEmail()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDTO createTask(CreateTaskDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = new Task();
        task.setTitle(dto.title());
        task.setProjectName(dto.projectName());
        task.setIsCompleted(false);
        task.setOwnerEmail(user.getEmail()); // Legam task-ul de email-ul userului

        return mapToDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDTO toggleTaskStatus(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        task.setIsCompleted(!task.getIsCompleted());
        return mapToDTO(taskRepository.save(task));
    }
    
    @Transactional
    public void deleteTask(Long id) {
         if(!taskRepository.existsById(id)) throw new ResourceNotFoundException("Task not found");
         taskRepository.deleteById(id);
    }

    private TaskResponseDTO mapToDTO(Task task) {
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getProjectName(), task.getIsCompleted());
    }
}