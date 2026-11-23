package com.company.management.users.service;

import com.company.management.common.exception.BadRequestException;
import com.company.management.common.exception.ConflictException;
import com.company.management.common.exception.ResourceNotFoundException;
import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.dto.UserDTOs.ChangePasswordDTO;
import com.company.management.users.dto.UserDTOs.UserCreateRequestDTO;
import com.company.management.users.dto.UserDTOs.UserPreferencesDTO;
import com.company.management.users.dto.UserDTOs.UserResponseDTO;
import com.company.management.users.dto.UserDTOs.UserUpdateRequestDTO;
import com.company.management.users.model.ProjectRole;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final String UPLOAD_URL_PREFIX = "/uploads/";

    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;
    private final Path uploadDir;

    public UserService(UserRepository userRepository,
                       MicroserviceRepository microserviceRepository,
                       TaskRepository taskRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.upload-dir:uploads}") String uploadDir) {
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(String username) {
        return mapToDTO(getUserOrThrow(username));
    }

    @Transactional
    public UserResponseDTO assignUserToProject(Long userId, Long projectId, ProjectRole projectRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Microservice project = microserviceRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        user.setProject(project);
        user.setProjectRole(projectRole != null ? projectRole : ProjectRole.DEVELOPER);
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO unassignUserFromProject(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProject(null);
        user.setProjectRole(null);
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO updateProfile(String currentUsername, UserUpdateRequestDTO dto) {
        User user = getUserOrThrow(currentUsername);

        if (dto.username() != null && !dto.username().isBlank()) {
            String newUsername = dto.username().trim();
            if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                throw new ConflictException("Username is already taken");
            }
            user.setUsername(newUsername);
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            String newEmail = dto.email().trim();
            String oldEmail = user.getEmail();
            if (!newEmail.equalsIgnoreCase(oldEmail)) {
                if (userRepository.existsByEmailIgnoreCase(newEmail)) {
                    throw new ConflictException("Email is already in use");
                }
                // Tasks are keyed by owner e-mail; keep them attached to this user.
                taskRepository.reassignOwner(oldEmail, newEmail);
            }
            user.setEmail(newEmail);
        }

        return mapToDTO(userRepository.save(user));
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
        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public String uploadAvatar(String username, MultipartFile file) {
        User user = getUserOrThrow(username);
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file uploaded");
        }

        // Decide the type from the file's actual bytes, never from the client-supplied name or
        // Content-Type, so an HTML/SVG file cannot be stored and later served from our origin.
        String extension = detectImageExtension(file);
        String fileName = "avatar-" + UUID.randomUUID() + extension;

        try {
            Files.createDirectories(uploadDir);
            Path target = uploadDir.resolve(fileName).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new BadRequestException("Invalid file name");
            }
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Could not store avatar", e);
        }

        deleteLocalAvatar(user.getAvatar());
        user.setAvatar(UPLOAD_URL_PREFIX + fileName);
        userRepository.save(user);
        return user.getAvatar();
    }

    @Transactional
    public UserResponseDTO registerNewUser(UserCreateRequestDTO dto) {
        String username = dto.username().trim();
        String email = dto.email().trim();
        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email is already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole("USER");
        user.setNotificationsEnabled(true);
        user.setThemePreference("LIGHT");
        return mapToDTO(userRepository.save(user));
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void deleteLocalAvatar(String avatar) {
        if (avatar == null || !avatar.startsWith(UPLOAD_URL_PREFIX)) return;
        Path old = uploadDir.resolve(avatar.substring(UPLOAD_URL_PREFIX.length())).normalize();
        if (!old.startsWith(uploadDir)) return;
        try {
            Files.deleteIfExists(old);
        } catch (IOException e) {
            log.warn("Could not delete old avatar {}", old, e);
        }
    }

    static String detectImageExtension(MultipartFile file) {
        byte[] header = new byte[12];
        int read;
        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(header, 0, header.length);
        } catch (IOException e) {
            throw new BadRequestException("Could not read uploaded file");
        }
        if (read >= 8 && startsWith(header, new byte[]{(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A})) {
            return ".png";
        }
        if (read >= 3 && startsWith(header, new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF})) {
            return ".jpg";
        }
        if (read >= 6 && (startsWith(header, "GIF87a".getBytes()) || startsWith(header, "GIF89a".getBytes()))) {
            return ".gif";
        }
        if (read >= 12 && startsWith(header, "RIFF".getBytes())
                && Arrays.equals(Arrays.copyOfRange(header, 8, 12), "WEBP".getBytes())) {
            return ".webp";
        }
        throw new BadRequestException("Only PNG, JPEG, GIF or WebP images are allowed");
    }

    private static boolean startsWith(byte[] data, byte[] prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) return false;
        }
        return true;
    }

    private UserResponseDTO mapToDTO(User user) {
        Microservice project = user.getProject();
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().toUpperCase(Locale.ROOT) : "USER",
                user.getAvatar(),
                user.getNotificationsEnabled(),
                user.getThemePreference(),
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                user.getProjectRole()
        );
    }
}
