package com.company.management.users.service;

import com.company.management.users.dto.UserDTOs.*;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final PasswordEncoder passwordEncoder;
    private final String UPLOAD_DIR = "uploads/";

    public UserService(UserRepository userRepository, MicroserviceRepository microserviceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO assignUserToProject(Long userId, Long projectId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (projectId != null) {
            Microservice project = microserviceRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
            
            user.setProject(project);
        }
        
        if (role != null) {
            user.setRole(role);
        }
        
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO unassignUserFromProject(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProject(null);
        return mapToDTO(userRepository.save(user));
    }

    public UserResponseDTO getUserProfile(String username) {
        return mapToDTO(getUserOrThrow(username));
    }

    @Transactional
    public UserResponseDTO updateProfile(String currentUsername, UserUpdateRequestDTO dto) {
        User currentUser = getUserOrThrow(currentUsername);
        if (dto.username() != null && !dto.username().isBlank()) currentUser.setUsername(dto.username());
        if (dto.email() != null && !dto.email().isBlank()) currentUser.setEmail(dto.email());
        return mapToDTO(userRepository.save(currentUser));
    }

    @Transactional
    public UserResponseDTO updatePreferences(String username, UserPreferencesDTO dto) {
        User user = getUserOrThrow(username);
        if (dto.notificationsEnabled() != null) user.setNotificationsEnabled(dto.notificationsEnabled());
        if (dto.themePreference() != null) user.setThemePreference(dto.themePreference());
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String username, ChangePasswordDTO dto) {
        User user = getUserOrThrow(username);
        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) throw new RuntimeException("Wrong password");
        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public String uploadAvatar(String username, MultipartFile file) {
        User user = getUserOrThrow(username);
        try {
            String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path path = Paths.get(UPLOAD_DIR);
            if (!Files.exists(path)) Files.createDirectories(path);
            Files.copy(file.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            user.setAvatar("/uploads/" + fileName);
            userRepository.save(user);
            return user.getAvatar();
        } catch (IOException e) { throw new RuntimeException(e); }
    }

    @Transactional
    public UserResponseDTO registerNewUser(UserCreateRequestDTO dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) throw new RuntimeException("Username exists");
        if (userRepository.findByEmail(dto.email()).isPresent()) throw new RuntimeException("Email exists");

        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole("USER");
        user.setNotificationsEnabled(true);
        user.setThemePreference("LIGHT");
        
        if (dto.avatar() != null && !dto.avatar().isBlank()) user.setAvatar(dto.avatar());
        return mapToDTO(userRepository.save(user));
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Not found"));
    }

    private UserResponseDTO mapToDTO(User user) {
        return new UserResponseDTO(
            user.getId(), user.getUsername(), user.getEmail(), user.getRole(),
            user.getAvatar(), user.getNotificationsEnabled(), user.getThemePreference(),
            user.getProject() != null ? user.getProject().getId() : null
        );
    }
}