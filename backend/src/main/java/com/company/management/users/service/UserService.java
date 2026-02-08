package com.company.management.users.service;

import com.company.management.users.dto.UserDTOs.*;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String UPLOAD_DIR = "uploads/";

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO registerNewUser(UserCreateRequestDTO dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole("USER");
        user.setNotificationsEnabled(true);
        user.setThemePreference("LIGHT");
        
        if (dto.avatar() != null && !dto.avatar().isEmpty()) {
            user.setAvatar(dto.avatar());
        }

        return mapToDTO(userRepository.save(user));
    }

    public UserResponseDTO getUserProfile(String username) {
        return mapToDTO(getUserOrThrow(username));
    }

    public UserResponseDTO updateProfile(String currentUsername, UserUpdateRequestDTO dto) {
        User currentUser = getUserOrThrow(currentUsername);

        if (dto.username() != null && !dto.username().trim().isEmpty() && !dto.username().equals(currentUser.getUsername())) {
            userRepository.findByUsername(dto.username())
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .ifPresent(u -> { throw new RuntimeException("Username already taken"); });
            currentUser.setUsername(dto.username());
        }

        if (dto.email() != null && !dto.email().trim().isEmpty() && !dto.email().equals(currentUser.getEmail())) {
            userRepository.findByEmail(dto.email())
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .ifPresent(u -> { throw new RuntimeException("Email already taken"); });
            currentUser.setEmail(dto.email());
        }

        return mapToDTO(userRepository.save(currentUser));
    }

    public UserResponseDTO updatePreferences(String username, UserPreferencesDTO dto) {
        User user = getUserOrThrow(username);

        if (dto.notificationsEnabled() != null) {
            user.setNotificationsEnabled(dto.notificationsEnabled());
        }
        if (dto.themePreference() != null) {
            user.setThemePreference(dto.themePreference());
        }

        return mapToDTO(userRepository.save(user));
    }

    public void changePassword(String username, ChangePasswordDTO dto) {
        User user = getUserOrThrow(username);

        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    public String uploadAvatar(String username, MultipartFile file) {
        User user = getUserOrThrow(username);

        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            if(originalName.contains("..")) throw new RuntimeException("Invalid path");

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID().toString() + "_" + originalName;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/uploads/" + fileName;
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            return avatarUrl;
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    private UserResponseDTO mapToDTO(User user) {
        return new UserResponseDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getAvatar(),
            user.getNotificationsEnabled(),
            user.getThemePreference()
        );
    }
}