package com.company.management.projects.service;

import org.springframework.stereotype.Service;

import com.company.management.projects.dto.CreateProjectRequestDTO;
import com.company.management.projects.dto.ProjectResponseDTO;
import com.company.management.projects.model.Project;
import com.company.management.projects.repository.ProjectRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
   public ProjectResponseDTO createProject(CreateProjectRequestDTO dto) {

        Project project = new Project(dto.name);
        Project saved = projectRepository.save(project);

        ProjectResponseDTO response = new ProjectResponseDTO();
        response.id = saved.getId();
        response.name = saved.getName();
        return response;
    }
}
