package com.company.management.dashboard.service;

import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.dashboard.dto.DashboardDTOs.DashboardData;
import com.company.management.dashboard.dto.DashboardDTOs.ProjectSummaryDTO;
import com.company.management.dashboard.dto.DashboardDTOs.StatsDTO;
import com.company.management.dashboard.dto.DashboardDTOs.TaskSummaryDTO;
import com.company.management.dashboard.dto.DashboardDTOs.UserSummaryDTO;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

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
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        List<Microservice> allServices = microserviceRepository.findAll(Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Task> userTasks = taskRepository.findByOwnerEmailIgnoreCaseOrderByIdDesc(user.getEmail());

        int activeProjectsCount = (int) allServices.stream()
                .filter(s -> "active".equalsIgnoreCase(s.getStatus()) || "running".equalsIgnoreCase(s.getStatus()))
                .count();
        int completedTasks = (int) userTasks.stream().filter(Task::getIsCompleted).count();
        int productivity = userTasks.isEmpty() ? 0 : completedTasks * 100 / userTasks.size();

        StatsDTO stats = new StatsDTO(
                activeProjectsCount,
                (int) userRepository.count(),
                completedTasks,
                productivity
        );

        List<ProjectSummaryDTO> projects = allServices.stream()
                .limit(5)
                .map(ms -> new ProjectSummaryDTO(
                        ms.getId().toString(),
                        ms.getName(),
                        ms.getVersion() != null ? ms.getVersion() : "v1.0",
                        relativeTime(ms.getUpdatedAt()),
                        ms.getStatus(),
                        ms.getTeamMembers().size()))
                .toList();

        List<TaskSummaryDTO> tasks = userTasks.stream()
                .limit(10)
                .map(t -> new TaskSummaryDTO(
                        t.getId().toString(),
                        t.getTitle(),
                        t.getProjectName(),
                        t.getIsCompleted(),
                        t.getDifficulty() != null ? t.getDifficulty().name() : null))
                .toList();

        UserSummaryDTO userDTO = new UserSummaryDTO(
                formatDisplayName(user.getUsername()),
                user.getEmail(),
                user.getAvatar()
        );

        return new DashboardData(userDTO, stats, projects, tasks);
    }

    static String relativeTime(LocalDateTime time) {
        if (time == null) return "never updated";
        Duration ago = Duration.between(time, LocalDateTime.now());
        if (ago.isNegative() || ago.toMinutes() < 1) return "just now";
        if (ago.toHours() < 1) return plural(ago.toMinutes(), "minute") + " ago";
        if (ago.toDays() < 1) return plural(ago.toHours(), "hour") + " ago";
        if (ago.toDays() < 30) return plural(ago.toDays(), "day") + " ago";
        return plural(ago.toDays() / 30, "month") + " ago";
    }

    private static String plural(long value, String unit) {
        return value + " " + unit + (value == 1 ? "" : "s");
    }

    private static String formatDisplayName(String username) {
        if (username == null || username.isEmpty()) return "User";
        return username.substring(0, 1).toUpperCase() + username.substring(1);
    }
}
