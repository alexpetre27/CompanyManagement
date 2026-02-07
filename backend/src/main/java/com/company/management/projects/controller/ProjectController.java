package com.company.management.projects.controller;

import com.company.management.projects.dto.ProjectDTOs.CreateProjectDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectDetailsDTO;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ProjectDetailsDTO> getProjectDetails(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectDetails(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Microservice> createProject(@RequestBody CreateProjectDTO dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    @GetMapping("/microservices")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<Microservice>> getAllMicroservices() {
        return ResponseEntity.ok(projectService.getAllMicroservices());
    }

    @PostMapping("/microservices/{id}/restart")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> restartService(@PathVariable Long id) {
        projectService.restartService(id);
        return ResponseEntity.ok("Restart command sent successfully");
    }
}