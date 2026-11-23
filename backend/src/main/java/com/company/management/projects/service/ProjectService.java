package com.company.management.projects.service;

import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.dto.ProjectDTOs.CreateProjectDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectDetailsDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectMemberDTO;
import com.company.management.projects.dto.ProjectDTOs.ProjectSummaryDTO;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.users.model.ProjectRole;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ProjectService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final MicroserviceRepository microserviceRepository;
    private final UserRepository userRepository;

    public ProjectService(MicroserviceRepository microserviceRepository, UserRepository userRepository) {
        this.microserviceRepository = microserviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectSummaryDTO> getAllProjects() {
        return microserviceRepository.findAll(Sort.by(Sort.Direction.DESC, "updatedAt")).stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailsDTO getProjectDetails(Long id) {
        Microservice entity = microserviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toDetails(entity);
    }

    @Transactional
    public ProjectDetailsDTO createProject(CreateProjectDTO dto) {
        Microservice project = new Microservice();
        project.setName(dto.name().trim());
        project.setVersion(blankToNull(dto.version()) != null ? dto.version().trim() : "v1.0.0");
        project.setPort(dto.port());
        project.setDescription(blankToNull(dto.description()));
        project.setRepoUrl(blankToNull(dto.repoUrl()));
        project.setLiveUrl(blankToNull(dto.liveUrl()));
        project.setStatus("ACTIVE");
        project.setUptime("0 days");
        project.setUpdatedAt(LocalDateTime.now());
        if (dto.techStack() != null) {
            project.setTechStack(new ArrayList<>(dto.techStack().stream().map(String::trim).distinct().toList()));
        }
        Microservice saved = microserviceRepository.save(project);

        if (dto.teamMembers() != null && !dto.teamMembers().isEmpty()) {
            List<User> members = userRepository.findByUsernameIn(dto.teamMembers());
            for (User member : members) {
                member.setProject(saved);
                if (member.getProjectRole() == null) member.setProjectRole(ProjectRole.DEVELOPER);
            }
            userRepository.saveAll(members);
            saved.getTeamMembers().addAll(members);
        }
        return toDetails(saved);
    }

    private ProjectSummaryDTO toSummary(Microservice entity) {
        return new ProjectSummaryDTO(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                normalizeStatus(entity.getStatus()),
                entity.getVersion(),
                entity.getPort(),
                entity.getUptime(),
                formatDate(entity.getUpdatedAt()),
                entity.getTeamMembers().size(),
                List.copyOf(entity.getTechStack()),
                entity.getRepoUrl(),
                entity.getLiveUrl()
        );
    }

    private ProjectDetailsDTO toDetails(Microservice entity) {
        List<ProjectMemberDTO> members = entity.getTeamMembers().stream()
                .map(user -> new ProjectMemberDTO(
                        String.valueOf(user.getId()),
                        user.getUsername(),
                        user.getProjectRole() != null ? capitalize(user.getProjectRole().name()) : "Developer",
                        user.getAvatar()))
                .toList();

        return new ProjectDetailsDTO(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                normalizeStatus(entity.getStatus()),
                entity.getVersion(),
                entity.getPort(),
                formatDate(entity.getUpdatedAt()),
                members.size(),
                List.copyOf(entity.getTechStack()),
                members,
                entity.getRepoUrl(),
                entity.getLiveUrl()
        );
    }

    private static String normalizeStatus(String status) {
        return status != null ? status.toUpperCase(Locale.ROOT) : "ACTIVE";
    }

    private static String formatDate(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_FORMATTER) : "N/A";
    }

    private static String capitalize(String value) {
        return value.charAt(0) + value.substring(1).toLowerCase(Locale.ROOT);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
