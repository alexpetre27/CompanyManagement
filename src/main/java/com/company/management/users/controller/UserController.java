package com.company.management.users.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.users.dto.UserCreateRequestDTO;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.model.user;
import com.company.management.users.service.UserService;

import io.micrometer.core.ipc.http.HttpSender.Response;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/users")
public class UserController {
        private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping
    public ResponseEntity<user> createUser(
        @RequestParam String username,
        @RequestParam String email,
        @RequestParam String password,
        @RequestParam Long projectId
    ){
        return ResponseEntity.ok(userService.createUser(username, email, password, projectId));
    }
    @PostMapping
    public ResponseEntity<user> createUser(
        @Valid @RequestBody UserCreateRequestDTO dto
    ) {
        return ResponseEntity.ok(userService.createUser(dto.username, dto.email,dto.password, dto.projectId));
    }
    
}
