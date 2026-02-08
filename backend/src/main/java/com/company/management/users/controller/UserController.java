package com.company.management.users.controller;

import com.company.management.users.dto.UserDTOs.*;
import com.company.management.users.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMe(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UserUpdateRequestDTO dto, Principal principal) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), dto));
    }

    @PatchMapping("/me/preferences")
    public ResponseEntity<UserResponseDTO> updatePreferences(@RequestBody UserPreferencesDTO dto, Principal principal) {
        return ResponseEntity.ok(userService.updatePreferences(principal.getName(), dto));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, Principal principal) {
        userService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Success"));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        return ResponseEntity.ok(Map.of("avatar", userService.uploadAvatar(principal.getName(), file)));
    }
}