package com.company.management.projects.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.projects.dto.CreateProjectRequestDTO;
import com.company.management.projects.dto.ProjectResponseDTO;
import com.company.management.projects.service.ProjectService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
           @Valid @RequestBody CreateProjectRequestDTO dto
    ) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }
}