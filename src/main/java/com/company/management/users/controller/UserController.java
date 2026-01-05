package com.company.management.users.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.users.dto.UserCreateRequestDTO;
import com.company.management.users.dto.UserResponseDTO;
import com.company.management.users.service.UserService;


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
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody UserCreateRequestDTO dto
    ) {
        return ResponseEntity.ok(userService.createUser(dto));
    }
}

    
