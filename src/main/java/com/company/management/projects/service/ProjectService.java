package com.company.management.projects.service;

import org.springframework.stereotype.Service;

import com.company.management.projects.model.Project;
import com.company.management.projects.repository.ProjectRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    public Project createProject(String name) {
        Project newProject = new Project(name);
        return projectRepository.save(newProject);
    }
}
