package com.company.management.auth.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.auth.dto.LoginRequestDTO;
import com.company.management.auth.dto.LoginResponseDTO;
import com.company.management.auth.service.AuthService;
import com.company.management.users.dto.UserCreateRequestDTO;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

     @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody UserCreateRequestDTO dto
    ) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto
    ) {
        return ResponseEntity.ok(authService.login(dto));
    }
}