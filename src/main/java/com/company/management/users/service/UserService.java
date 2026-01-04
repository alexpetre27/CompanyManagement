package com.company.management.users.service;

import org.springframework.stereotype.Service;

import com.company.management.projects.model.Project;
import com.company.management.projects.repository.ProjectRepository;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.model.user;
import com.company.management.users.repository.UserRepository;

@Service
public class UserService{
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    public UserService(UserRepository userRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
    public user createUser(String username, String email, String password, Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        user user = new user(username, email, password, project);
        return userRepository.save(user);
    }
    private UserResponseDTO mapToDTO(user user){
        UserResponseDTO dto = new UserResponseDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.projectId = user.getProject().getId();
        return dto;
    }

}