package com.company.management.users.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.management.common.exception.BadRequestException;
import com.company.management.common.exception.ConflictException;
import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.model.Project;
import com.company.management.projects.repository.ProjectRepository;
import com.company.management.users.dto.UserCreateRequestDTO;
import com.company.management.users.dto.UserResponseDTO;

import com.company.management.users.model.user;
import com.company.management.users.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserCreateRequestDTO dto) {

        if (dto.username == null || dto.username.isBlank()) {
            throw new BadRequestException("Username cannot be empty");
        }
        if (dto.email == null || dto.email.isBlank()) {
            throw new BadRequestException("Email cannot be empty");
        }

        if (userRepository.findByEmail(dto.email).isPresent()) {
            throw new ConflictException("User already exists with this email");
        }

        Project project = projectRepository.findById(dto.projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + dto.projectId));

        String encodedPassword = passwordEncoder.encode(dto.password);
        user user = new user(
            dto.username,
            dto.email,
            encodedPassword,
            project
        );
        user saved = userRepository.save(user);

        return mapToDTO(saved);
    }

    private UserResponseDTO mapToDTO(user user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        return dto;
    }

    public UserResponseDTO getUserByEmail(String username) {
        user user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + username));
        return mapToDTO(user);
    }

   
}
