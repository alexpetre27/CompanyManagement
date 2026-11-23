package com.company.management.admin.controller;

import com.company.management.admin.dto.AdminDTOs.AdminStatsDTO;
import com.company.management.admin.dto.AdminDTOs.LockdownDTO;
import com.company.management.admin.dto.AdminDTOs.MessageDTO;
import com.company.management.admin.service.AdminStatsService;
import com.company.management.admin.service.MaintenanceModeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.cache.CacheManager;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final ConfigurableApplicationContext context;
    private final ObjectProvider<CacheManager> cacheManager;
    private final MaintenanceModeService maintenanceModeService;
    private final AdminStatsService adminStatsService;

    public AdminController(ConfigurableApplicationContext context,
                           ObjectProvider<CacheManager> cacheManager,
                           MaintenanceModeService maintenanceModeService,
                           AdminStatsService adminStatsService) {
        this.context = context;
        this.cacheManager = cacheManager;
        this.maintenanceModeService = maintenanceModeService;
        this.adminStatsService = adminStatsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getStats());
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getSystemStatus() {
        return ResponseEntity.ok(Map.of("maintenance", maintenanceModeService.isEnabled()));
    }

    /**
     * Stops the JVM with a non-zero exit code; the container's restart policy brings it back.
     * Without a supervisor (e.g. running from an IDE) this is equivalent to a shutdown.
     */
    @PostMapping("/restart")
    public ResponseEntity<MessageDTO> restartApp(Principal principal) {
        log.warn("Restart requested by {}", principal.getName());
        exitAsync(1);
        return ResponseEntity.ok(new MessageDTO("Restart sequence initiated. System will be back in 10-20 seconds."));
    }

    @PostMapping("/shutdown")
    public ResponseEntity<MessageDTO> shutdownApp(Principal principal) {
        log.warn("Shutdown requested by {}", principal.getName());
        exitAsync(0);
        return ResponseEntity.ok(new MessageDTO("Shutdown signal sent."));
    }

    @PostMapping("/flush-cache")
    public ResponseEntity<MessageDTO> flushCache() {
        CacheManager manager = cacheManager.getIfAvailable();
        if (manager == null) {
            return ResponseEntity.ok(new MessageDTO("No cache is configured; nothing to flush."));
        }
        manager.getCacheNames().forEach(name -> {
            var cache = manager.getCache(name);
            if (cache != null) cache.clear();
        });
        return ResponseEntity.ok(new MessageDTO("All system caches have been flushed successfully."));
    }

    @PostMapping("/lockdown")
    public ResponseEntity<LockdownDTO> toggleLockdown(Principal principal) {
        boolean locked = maintenanceModeService.toggle();
        log.warn("Maintenance mode {} by {}", locked ? "enabled" : "disabled", principal.getName());
        return ResponseEntity.ok(new LockdownDTO(
                locked ? "LOCKED" : "UNLOCKED",
                locked
                        ? "System is now in maintenance mode. Only administrators can use the API."
                        : "System is now live. Access restored."));
    }

    /** Exits after the HTTP response has been flushed. */
    private void exitAsync(int code) {
        CompletableFuture.runAsync(
                () -> System.exit(SpringApplication.exit(context, () -> code)),
                CompletableFuture.delayedExecutor(1, TimeUnit.SECONDS));
    }
}
