package com.company.management.auth.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.management.auth.dto.AuthRequestDTO;
import com.company.management.auth.service.AuthService;
import com.company.management.users.model.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<user> register(@RequestBody AuthRequestDTO authRequest) {
        user registeredUser = authService.register(
            authRequest.getUsername(),
            authRequest.getEmail(),
             authRequest.getPassword(),
             authRequest.getProject()
        );
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequestDTO authRequest) {
        boolean success = authService.login(authRequest.getUsername(), authRequest.getPassword());
        if(success)
            return ResponseEntity.ok("You're logged in!");
        else
            return ResponseEntity.status(401).body("Invalid credentials");
    }
}