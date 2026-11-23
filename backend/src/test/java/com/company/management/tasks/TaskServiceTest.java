package com.company.management.tasks;

import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.dto.TaskDTOs.CreateTaskDTO;
import com.company.management.tasks.dto.TaskDTOs.TaskResponseDTO;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.model.TaskDifficulty;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.tasks.service.TaskService;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskRepository taskRepository;
    private UserRepository userRepository;
    private MicroserviceRepository microserviceRepository;
    private TaskService taskService;

    private final User alice = user("alice", "alice@example.com");
    private final User bob = user("bob", "bob@example.com");

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        userRepository = mock(UserRepository.class);
        microserviceRepository = mock(MicroserviceRepository.class);
        taskService = new TaskService(taskRepository, userRepository, microserviceRepository);

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(alice));
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(bob));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Microservice project = new Microservice();
        project.setId(10L);
        project.setName("Billing");
        when(microserviceRepository.findById(10L)).thenReturn(Optional.of(project));
    }

    @Test
    void userCannotToggleSomeoneElsesTask() {
        when(taskRepository.findByIdAndOwnerEmailIgnoreCase(1L, "bob@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.toggleTaskStatus(1L, "bob"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(taskRepository, never()).save(any());
    }

    @Test
    void userCannotDeleteSomeoneElsesTask() {
        when(taskRepository.findByIdAndOwnerEmailIgnoreCase(1L, "bob@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(1L, "bob"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(taskRepository, never()).delete(any());
    }

    @Test
    void ownerCanToggleOwnTask() {
        Task task = new Task();
        task.setId(1L);
        task.setOwnerEmail("alice@example.com");
        when(taskRepository.findByIdAndOwnerEmailIgnoreCase(1L, "alice@example.com")).thenReturn(Optional.of(task));

        TaskResponseDTO result = taskService.toggleTaskStatus(1L, "alice");

        assertThat(result.isCompleted()).isTrue();
    }

    @Test
    void createTaskResolvesProjectNameAndDefaultsDifficulty() {
        TaskResponseDTO result = taskService.createTask(new CreateTaskDTO("Write docs", 10L, null, null), "alice", false);

        assertThat(result.projectName()).isEqualTo("Billing");
        assertThat(result.difficulty()).isEqualTo(TaskDifficulty.LOW);
    }

    @Test
    void nonAdminCannotAssignTasksToOthers() {
        taskService.createTask(new CreateTaskDTO("Sneaky", 10L, TaskDifficulty.HIGH, 2L), "alice", false);

        ArgumentCaptor<Task> saved = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(saved.capture());
        assertThat(saved.getValue().getOwnerEmail()).isEqualTo("alice@example.com");
        verify(userRepository, never()).findById(any());
    }

    @Test
    void adminCanAssignTasksToOthers() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(bob));

        taskService.createTask(new CreateTaskDTO("Review", 10L, TaskDifficulty.MEDIUM, 2L), "alice", true);

        ArgumentCaptor<Task> saved = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(saved.capture());
        assertThat(saved.getValue().getOwnerEmail()).isEqualTo("bob@example.com");
    }

    private static User user(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        return user;
    }
}
