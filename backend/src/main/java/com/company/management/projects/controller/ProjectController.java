package com.company.management.projects.controller;

import com.company.management.projects.dto.ProjectDTOs.CreateProjectDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectDetailsDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectSummaryDTO;
import com.company.management.projects.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ProjectDetailsDTO> createProject(@Valid @RequestBody CreateProjectDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(dto));
    }

    @GetMapping("/microservices")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<ProjectSummaryDTO>> getAllMicroservices() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
}
