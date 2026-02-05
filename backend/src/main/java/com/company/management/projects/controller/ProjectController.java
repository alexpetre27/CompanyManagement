package com.company.management.projects.controller;

import com.company.management.projects.dto.CreateProjectDTO;
import com.company.management.projects.dto.ProjectDetailsDTO;
import com.company.management.projects.dto.ProjectMemberDTO;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final MicroserviceRepository microserviceRepository;
    private final UserRepository userRepository;

    public ProjectController(MicroserviceRepository microserviceRepository, UserRepository userRepository) {
        this.microserviceRepository = microserviceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ProjectDetailsDTO> getProjectDetails(@PathVariable Long id) {
        Optional<Microservice> projectOpt = microserviceRepository.findById(id);

       if (projectOpt.isEmpty()) return ResponseEntity.notFound().build();
        Microservice entity = projectOpt.get();
        ProjectDetailsDTO dto = new ProjectDetailsDTO();


        dto.id = entity.getId();
        dto.name = entity.getName();
        dto.version = entity.getVersion();
        dto.status = entity.getStatus() != null ? entity.getStatus().toUpperCase() : "ACTIVE";
        dto.description = entity.getDescription();
        dto.repoUrl = entity.getRepoUrl();
        dto.liveUrl = entity.getLiveUrl();
        dto.techStack = entity.getTechStack();
        List<ProjectMemberDTO> members = new ArrayList<>();
        if (entity.getTeamMembers() != null) {
            for (int i = 0; i < entity.getTeamMembers().size(); i++) {
                String memberName = entity.getTeamMembers().get(i);
                members.add(new ProjectMemberDTO(
                    String.valueOf(i), 
                    memberName, 
                    "Developer", 
                    memberName.substring(0, Math.min(2, memberName.length())).toUpperCase()
                ));
            }
        }
        dto.team = members;
        dto.teamCount = members.size();
        
        return ResponseEntity.ok(dto);
    }
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Microservice> createProject(@RequestBody CreateProjectDTO dto) {
        Microservice project = new Microservice();
        
        project.setName(dto.name);
        project.setVersion(dto.version);
        project.setPort(dto.port);
        project.setDescription(dto.description);
        project.setRepoUrl(dto.repoUrl);
        project.setLiveUrl(dto.liveUrl);
        project.setStatus("ACTIVE");
        project.setUptime("0 days");     
        
        if (dto.techStack != null) project.setTechStack(dto.techStack);
        if (dto.teamMembers != null) project.setTeamMembers(dto.teamMembers);

        Microservice saved = microserviceRepository.save(project);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/microservices")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<Microservice>> getAllMicroservices() {
        return ResponseEntity.ok(microserviceRepository.findAll());
    }

    @PostMapping("/microservices/{id}/restart")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> restartService(@PathVariable Long id) {
        return ResponseEntity.ok("Restart command sent successfully");
    }
}