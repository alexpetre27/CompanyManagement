package com.company.management.projects.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.projects.dto.ProjectResponseDTO;
import com.company.management.projects.model.Project;
import com.company.management.projects.repository.ProjectRepository;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.model.user;
import com.company.management.users.repository.UserRepository;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    
    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{projectId}/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addUserToProject(
        @PathVariable Long projectId,
        @RequestBody Long userId
    ){
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found with id " + projectId));
        List<Long> userIds = userRepository.findAll().stream()  .filter(u -> u.getProject() != null && u.getProject().getId().equals(project.getId()))
                .map(u -> u.getId())
                .collect(Collectors.toList());
                return ResponseEntity.ok("Users in project: " + userIds.toString());
                
    }
     @GetMapping("/{projectId}/users")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<UserResponseDTO>> listUsersPerProject(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<UserResponseDTO> users = project.getUsers().stream().map(u -> {
            UserResponseDTO dto = new UserResponseDTO();
            dto.id = u.getId();
            dto.username = u.getUsername();
            dto.email = u.getEmail();
            dto.projectIds = u.getProjects().stream().map(Project::getId).collect(Collectors.toList());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
    @GetMapping("/users/{userId}/projects")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<ProjectResponseDTO>> listProjectsPerUser(@PathVariable Long userId) {
        user user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

      List<ProjectResponseDTO> list = user.getProjects().stream()
    .map(p -> {
        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        return dto;
    })
    .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

}
    