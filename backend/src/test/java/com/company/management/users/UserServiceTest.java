package com.company.management.users;

import com.company.management.common.exception.BadRequestException;
import com.company.management.common.exception.ConflictException;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.tasks.repository.TaskRepository;
import com.company.management.users.dto.UserDTOs.ChangePasswordDTO;
import com.company.management.users.dto.UserDTOs.UserCreateRequestDTO;
import com.company.management.users.dto.UserDTOs.UserResponseDTO;
import com.company.management.users.dto.UserDTOs.UserUpdateRequestDTO;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import com.company.management.users.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @TempDir
    Path uploadDir;

    private UserRepository userRepository;
    private TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private UserService userService;
    private User alice;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        taskRepository = mock(TaskRepository.class);
        userService = new UserService(userRepository, mock(MicroserviceRepository.class), taskRepository,
                passwordEncoder, uploadDir.toString());

        alice = new User();
        alice.setUsername("alice");
        alice.setEmail("alice@example.com");
        alice.setPassword(passwordEncoder.encode("secret1"));
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(alice));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void registerRejectsDuplicateEmailWithConflict() {
        when(userRepository.existsByEmailIgnoreCase("Alice@Example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerNewUser(
                new UserCreateRequestDTO("newuser", "Alice@Example.com", "password1")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void registeredUsersAlwaysGetTheUserRole() {
        UserResponseDTO result = userService.registerNewUser(new UserCreateRequestDTO("newuser", "n@example.com", "password1"));

        assertThat(result.role()).isEqualTo("USER");
    }

    @Test
    void changePasswordWithWrongCurrentPasswordIsABadRequest() {
        assertThatThrownBy(() -> userService.changePassword("alice", new ChangePasswordDTO("wrong", "newpass1")))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void changePasswordStoresANewHash() {
        userService.changePassword("alice", new ChangePasswordDTO("secret1", "newpass1"));

        assertThat(passwordEncoder.matches("newpass1", alice.getPassword())).isTrue();
    }

    @Test
    void updateProfileRejectsTakenUsername() {
        when(userRepository.existsByUsername("bob")).thenReturn(true);

        assertThatThrownBy(() -> userService.updateProfile("alice", new UserUpdateRequestDTO("bob", null)))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void changingEmailKeepsTasksAttached() {
        userService.updateProfile("alice", new UserUpdateRequestDTO(null, "alice@new.example.com"));

        verify(taskRepository).reassignOwner("alice@example.com", "alice@new.example.com");
        assertThat(alice.getEmail()).isEqualTo("alice@new.example.com");
    }

    @Test
    void avatarUploadRejectsNonImages() {
        MockMultipartFile html = new MockMultipartFile("file", "avatar.png", "image/png",
                "<html><script>alert(1)</script></html>".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> userService.uploadAvatar("alice", html))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void avatarUploadStoresPngUnderGeneratedName() throws Exception {
        byte[] png = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "../../etc/evil.html", "text/html", png);

        String url = userService.uploadAvatar("alice", file);

        assertThat(url).startsWith("/uploads/avatar-").endsWith(".png");
        try (var files = Files.list(uploadDir)) {
            assertThat(files.count()).isEqualTo(1);
        }
    }
}
