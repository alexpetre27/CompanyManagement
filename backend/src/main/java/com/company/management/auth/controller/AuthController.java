package com.company.management.auth.controller;

import com.company.management.auth.dto.AuthDTOs.LoginRequestDTO;
import com.company.management.auth.dto.AuthDTOs.LoginResponseDTO;
import com.company.management.auth.service.AuthService;
import com.company.management.users.dto.UserDTOs.UserCreateRequestDTO;
import com.company.management.users.dto.UserDTOs.UserResponseDTO;    
import com.company.management.users.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserCreateRequestDTO dto) {
        return ResponseEntity.ok(userService.registerNewUser(dto));
    }
}