package com.company.management.admin.controller;

import com.company.management.admin.service.MaintenanceModeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Public, read-only system state so the UI can tell users why data is unavailable. */
@RestController
@RequestMapping("/api/system")
public class SystemStatusController {

    private final MaintenanceModeService maintenanceModeService;

    public SystemStatusController(MaintenanceModeService maintenanceModeService) {
        this.maintenanceModeService = maintenanceModeService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status() {
        return ResponseEntity.ok(Map.of("maintenance", maintenanceModeService.isEnabled()));
    }
}
