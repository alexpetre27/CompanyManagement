package com.company.management.tasks.service;

import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.dto.TaskDTOs.CreateTaskDTO;
import com.company.management.tasks.dto.TaskDTOs.TaskResponseDTO;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.model.TaskDifficulty;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;

    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       MicroserviceRepository microserviceRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getMyTasks(String username) {
        User user = getUser(username);
        return taskRepository.findByOwnerEmailIgnoreCaseOrderByIdDesc(user.getEmail()).stream()
                .map(TaskService::mapToDTO)
                .toList();
    }

    @Transactional
    public TaskResponseDTO createTask(CreateTaskDTO dto, String username, boolean isAdmin) {
        User owner = getUser(username);
        if (isAdmin && dto.assigneeId() != null) {
            owner = userRepository.findById(dto.assigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }
        Microservice project = microserviceRepository.findById(dto.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(dto.title().trim());
        task.setProjectName(project.getName());
        task.setDifficulty(dto.difficulty() != null ? dto.difficulty() : TaskDifficulty.LOW);
        task.setIsCompleted(false);
        task.setOwnerEmail(owner.getEmail());
        return mapToDTO(taskRepository.save(task));
    }

    /** Only the owner may change a task; anyone else gets 404 so task ids cannot be probed. */
    @Transactional
    public TaskResponseDTO toggleTaskStatus(Long id, String username) {
        Task task = getOwnedTask(id, username);
        task.setIsCompleted(!task.getIsCompleted());
        return mapToDTO(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id, String username) {
        taskRepository.delete(getOwnedTask(id, username));
    }

    private Task getOwnedTask(Long id, String username) {
        User user = getUser(username);
        return taskRepository.findByIdAndOwnerEmailIgnoreCase(id, user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private static TaskResponseDTO mapToDTO(Task task) {
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getProjectName(),
                task.getIsCompleted(), task.getDifficulty());
    }
}
