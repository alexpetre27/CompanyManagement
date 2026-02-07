package com.company.management.projects.service;

import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.dto.ProjectDTOs.*;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final MicroserviceRepository microserviceRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public ProjectService(MicroserviceRepository microserviceRepository) {
        this.microserviceRepository = microserviceRepository;
    }

    public List<Microservice> getAllMicroservices() {
        return microserviceRepository.findAll();
    }

    public ProjectDetailsDTO getProjectDetails(Long id) {
        Microservice entity = microserviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        return mapToDetailsDTO(entity);
    }

    @Transactional
    public Microservice createProject(CreateProjectDTO dto) {
        Microservice project = new Microservice();
        project.setName(dto.name());
        project.setVersion(dto.version());
        project.setPort(dto.port());
        project.setDescription(dto.description());
        project.setRepoUrl(dto.repoUrl());
        project.setLiveUrl(dto.liveUrl());
        project.setStatus("ACTIVE");
        project.setUptime("0 days");
        

        if (dto.techStack() != null) project.setTechStack(dto.techStack());
        if (dto.teamMembers() != null) project.setTeamMembers(dto.teamMembers());

        return microserviceRepository.save(project);
    }

    @Transactional
    public void restartService(Long id) {
        Microservice service = microserviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        System.out.println(">>> RESTARTING SERVICE: " + service.getName());
        
        service.setStatus("RESTARTING");
        microserviceRepository.save(service);
    }

    private ProjectDetailsDTO mapToDetailsDTO(Microservice entity) {
        List<ProjectMemberDTO> members = new ArrayList<>();
        
        if (entity.getTeamMembers() != null) {
            for (int i = 0; i < entity.getTeamMembers().size(); i++) {
                String memberName = entity.getTeamMembers().get(i);
                members.add(new ProjectMemberDTO(
                    String.valueOf(i),
                    memberName,
                    "Developer",
                    generateInitials(memberName)
                ));
            }
        }

        String formattedDate = "N/A";
        if (entity.getUpdatedAt() != null) {
            formattedDate = entity.getUpdatedAt().format(DATE_FORMATTER);
        }

        return new ProjectDetailsDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getStatus() != null ? entity.getStatus().toUpperCase() : "ACTIVE",
            entity.getVersion(),
            formattedDate, 
            members.size(),
            entity.getTechStack(),
            members,
            entity.getRepoUrl(),
            entity.getLiveUrl()
        );
    }

    private String generateInitials(String name) {
        if (name == null || name.isEmpty()) return "U";
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}