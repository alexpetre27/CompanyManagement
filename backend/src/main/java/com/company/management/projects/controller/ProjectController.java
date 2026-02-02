package com.company.management.projects.controller;

import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final MicroserviceRepository microserviceRepository;

    public ProjectController(MicroserviceRepository microserviceRepository) {
        this.microserviceRepository = microserviceRepository;
    }

    @GetMapping("/microservices")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<Microservice>> getAllMicroservices() {
        return ResponseEntity.ok(microserviceRepository.findAll());
    }

    @PostMapping("/microservices/{id}/restart")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> restartService(@PathVariable Long id) {
        System.out.println("Restart command for service: " + id);
        return ResponseEntity.ok("Restart command sent successfully");
    }
}