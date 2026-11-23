package com.company.management.admin.dto;

import java.util.List;

public class AdminDTOs {

    public record AdminStatsDTO(
            long totalUsers,
            long newUsersToday,
            String serverLoad,
            long errorCount,
            int activeSessions,
            List<SystemEventDTO> systemEvents
    ) {}

    public record SystemEventDTO(
            Long id,
            String action,
            String user,
            String time
    ) {}

    public record MessageDTO(String message) {}

    public record LockdownDTO(String status, String message) {}
}
