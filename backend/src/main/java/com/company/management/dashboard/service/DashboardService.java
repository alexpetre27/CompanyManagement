package com.company.management.dashboard.service;

import com.company.management.dashboard.dto.DashboardDTOs.*;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final TaskRepository taskRepository;

    public DashboardService(UserRepository userRepository,
                            MicroserviceRepository microserviceRepository,
                            TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public DashboardData getDashboardSummary(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<Microservice> allServices = microserviceRepository.findAll();
        List<Task> userTasks = taskRepository.findByOwnerEmail(user.getEmail());
        long totalUsers = userRepository.count();

        int activeProjectsCount = (int) allServices.stream()
                .filter(s -> "active".equalsIgnoreCase(s.getStatus()) || "running".equalsIgnoreCase(s.getStatus()))
                .count();

        int completedTasks = (int) userTasks.stream().filter(Task::getIsCompleted).count();
        
        int productivity = userTasks.isEmpty() ? 0 : (completedTasks * 100 / userTasks.size());


        int hoursWorked = activeProjectsCount * 40; 

        StatsDTO stats = new StatsDTO(
                activeProjectsCount,
                (int) totalUsers,
                hoursWorked,
                productivity
        );

        List<ProjectSummaryDTO> projects = allServices.stream()
                .limit(5)
                .map(ms -> new ProjectSummaryDTO(
                        ms.getId().toString(),
                        ms.getName(),
                        ms.getVersion() != null ? ms.getVersion() : "v1.0",
                        "2 days ago", 
                        ms.getStatus(),
                        ms.getTeamMembers() != null ? ms.getTeamMembers().size() : 0
                ))
                .collect(Collectors.toList());

        List<TaskSummaryDTO> tasks = userTasks.stream()
                .limit(10)
                .map(t -> new TaskSummaryDTO(
                        t.getId().toString(),
                        t.getTitle(),
                        t.getProjectName(),
                        t.getIsCompleted()
                ))
                .collect(Collectors.toList());

        UserSummaryDTO userDTO = new UserSummaryDTO(
                formatDisplayName(user.getUsername()),
                user.getEmail(),
                user.getAvatar()
        );

        return new DashboardData(userDTO, stats, projects, tasks);
    }

    private String formatDisplayName(String username) {
        if (username == null || username.isEmpty()) return "User";
        return username.substring(0, 1).toUpperCase() + username.substring(1);
    }
}