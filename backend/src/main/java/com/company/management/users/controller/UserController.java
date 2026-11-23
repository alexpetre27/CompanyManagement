package com.company.management.users.controller;

import com.company.management.users.dto.UserDTOs.AssignUserRequestDTO;
import com.company.management.users.dto.UserDTOs.ChangePasswordDTO;
import com.company.management.users.dto.UserDTOs.UserPreferencesDTO;
import com.company.management.users.dto.UserDTOs.UserResponseDTO;
import com.company.management.users.dto.UserDTOs.UserUpdateRequestDTO;
import com.company.management.users.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMe(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@Valid @RequestBody UserUpdateRequestDTO dto, Principal principal) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), dto));
    }

    @PatchMapping("/me/preferences")
    public ResponseEntity<UserResponseDTO> updatePreferences(@Valid @RequestBody UserPreferencesDTO dto, Principal principal) {
        return ResponseEntity.ok(userService.updatePreferences(principal.getName(), dto));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordDTO dto, Principal principal) {
        userService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        return ResponseEntity.ok(Map.of("avatar", userService.uploadAvatar(principal.getName(), file)));
    }

    @PatchMapping("/{userId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> assignUser(@PathVariable Long userId, @Valid @RequestBody AssignUserRequestDTO dto) {
        return ResponseEntity.ok(userService.assignUserToProject(userId, dto.projectId(), dto.projectRole()));
    }

    @PatchMapping("/{userId}/unassign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> unassignUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.unassignUserFromProject(userId));
    }
}
