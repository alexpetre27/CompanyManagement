package com.company.management.admin.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.cache.CacheManager;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    @Autowired
    private ConfigurableApplicationContext context;

    @Autowired(required = false)
    private CacheManager cacheManager;

    private static boolean isMaintenanceMode = false;

  
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restartApp() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Restart sequence initiated. System will be back in 10-20 seconds.");
        
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(1000); 
                SpringApplication.exit(context, () -> 0);
  
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        return ResponseEntity.ok(response);
    }
    @PostMapping("/flush-cache")
    public ResponseEntity<Map<String, String>> flushCache() {
        Map<String, String> response = new HashMap<>();
        
        if (cacheManager != null) {
            cacheManager.getCacheNames()
                .forEach(cacheName -> {
                    var cache = cacheManager.getCache(cacheName);
                    if (cache != null) cache.clear();
                });
            response.put("message", "All system caches have been flushed successfully.");
        } else {
            response.put("message", "No CacheManager configured, but command executed.");
        }

        return ResponseEntity.ok(response);
    }


    @PostMapping("/lockdown")
    public ResponseEntity<Map<String, String>> toggleLockdown() {
        isMaintenanceMode = !isMaintenanceMode;
        
        Map<String, String> response = new HashMap<>();
        response.put("status", isMaintenanceMode ? "LOCKED" : "UNLOCKED");
        response.put("message", isMaintenanceMode 
            ? "System is now in Maintenance Mode. User access restricted." 
            : "System is now Live. Access restored.");

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status")
    @PreAuthorize("permitAll()") 
    public ResponseEntity<Map<String, Boolean>> getSystemStatus() {
         return ResponseEntity.ok(Map.of("maintenance", isMaintenanceMode));
    }


    @PostMapping("/shutdown")
    public void shutdownApp() {
        System.exit(0);
    }
}