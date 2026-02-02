package com.company.management.dashboard.controller;

import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.model.Task;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.repository.UserRepository;
import com.company.management.users.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final TaskRepository taskRepository;

    public DashboardController(UserService userService, 
                               UserRepository userRepository,
                               MicroserviceRepository microserviceRepository,
                               TaskRepository taskRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardData> getDashboardSummary(@RequestParam String email) {
        DashboardData data = new DashboardData();
      try {
            UserResponseDTO realUser = userService.getUserByEmail(email);
            
            String dbUsername = realUser.username;
            
            if (dbUsername != null && !dbUsername.isEmpty()) {
                dbUsername = dbUsername.substring(0, 1).toUpperCase() + dbUsername.substring(1);
            } else {
                dbUsername = "Unknown";
            }
            
            data.setUser(new UserDTO(dbUsername, realUser.email, null));

        } catch (Exception e) {
  
            String fallbackName = "Guest";
            if (email != null && email.contains("@")) {
                fallbackName = email.split("@")[0]; 
            }
            data.setUser(new UserDTO(fallbackName, email, null));
        }

        List<Microservice> realServices = microserviceRepository.findAll();
        List<Task> realTasks = taskRepository.findByOwnerEmail(email);
        long totalUsers = userRepository.count();
        if (totalUsers == 0) totalUsers = 1; 

        int activeProjectsCount = (int) realServices.stream()
            .filter(s -> "active".equalsIgnoreCase(s.getStatus()) || "running".equalsIgnoreCase(s.getStatus()))
            .count();
        if (activeProjectsCount == 0 && !realServices.isEmpty()) activeProjectsCount = realServices.size();

        int completedTasks = (int) realTasks.stream().filter(Task::getIsCompleted).count();
        int productivity = realTasks.isEmpty() ? 0 : (completedTasks * 100 / realTasks.size());

        StatsDTO stats = new StatsDTO();
        stats.setActiveProjects(realServices.size());
        stats.setTeamMembers((int) totalUsers);
        stats.setHoursWorked(realServices.size() * 12);
        stats.setProductivity(productivity);
        data.setStats(stats);

        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for (Microservice ms : realServices) {
            projectDTOs.add(new ProjectDTO(
                ms.getId().toString(),
                ms.getName(),
                ms.getVersion() != null ? ms.getVersion() : "v1.0",
                ms.getUptime() != null ? ms.getUptime() : "Offline",
                (int) (Math.random() * 10) + 1 
            ));
        }
        data.setRecentProjects(projectDTOs);

        List<TaskDTO> taskDTOs = new ArrayList<>();
        for (Task t : realTasks) {
            taskDTOs.add(new TaskDTO(
                t.getId().toString(),
                t.getTitle(),
                t.getProjectName(),
                t.getIsCompleted()
            ));
        }
        data.setTodayTasks(taskDTOs);

        return ResponseEntity.ok(data);
    }

    public static class DashboardData {
        public UserDTO user;
        public StatsDTO stats;
        public List<ProjectDTO> recentProjects;
        public List<TaskDTO> todayTasks;
        public void setUser(UserDTO user) { this.user = user; }
        public void setStats(StatsDTO stats) { this.stats = stats; }
        public void setRecentProjects(List<ProjectDTO> recentProjects) { this.recentProjects = recentProjects; }
        public void setTodayTasks(List<TaskDTO> todayTasks) { this.todayTasks = todayTasks; }
    }

    public static class UserDTO {
        public String name;
        public String email;
        public String image;
        public UserDTO(String name, String email, String image) {
            this.name = name; this.email = email; this.image = image;
        }
    }

    public static class StatsDTO {
        public int activeProjects;
        public int teamMembers;
        public int hoursWorked;
        public int productivity;
        public void setActiveProjects(int activeProjects) { this.activeProjects = activeProjects; }
        public void setTeamMembers(int teamMembers) { this.teamMembers = teamMembers; }
        public void setHoursWorked(int hoursWorked) { this.hoursWorked = hoursWorked; }
        public void setProductivity(int productivity) { this.productivity = productivity; }
    }

    public static class ProjectDTO {
        public String id;
        public String name;
        public String version;
        public String updatedAt;
        public int teamCount;
        public ProjectDTO(String id, String name, String version, String updatedAt, int teamCount) {
            this.id = id; this.name = name; this.version = version; this.updatedAt = updatedAt; this.teamCount = teamCount;
        }
    }

    public static class TaskDTO {
        public String id;
        public String title;
        public String projectName;
        public boolean isCompleted;
        public TaskDTO(String id, String title, String projectName, boolean isCompleted) {
            this.id = id; this.title = title; this.projectName = projectName; this.isCompleted = isCompleted;
        }
    }
}