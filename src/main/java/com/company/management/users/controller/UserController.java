package com.company.management.users.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.company.management.users.dto.UserCreateRequestDTO;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(
           @Valid @RequestBody UserCreateRequestDTO dto
    ) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        UserResponseDTO dto = userService.getUserByEmail(userDetails.getUsername());

        return ResponseEntity.ok(dto);
    }
}
