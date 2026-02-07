package com.company.management.dashboard.controller;

import com.company.management.dashboard.dto.DashboardDTOs.DashboardData;
import com.company.management.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardData> getDashboardSummary(Authentication authentication) {
        String username = authentication.getName();
        
        DashboardData data = dashboardService.getDashboardSummary(username);
        
        return ResponseEntity.ok(data);
    }
}