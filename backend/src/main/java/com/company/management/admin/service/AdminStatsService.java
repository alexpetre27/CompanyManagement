package com.company.management.admin.service;

import com.company.management.admin.dto.AdminDTOs.AdminStatsDTO;
import com.company.management.admin.dto.AdminDTOs.SystemEventDTO;
import com.company.management.common.exception.ErrorCounter;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AdminStatsService {

    private static final DateTimeFormatter EVENT_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final UserRepository userRepository;
    private final ActivityTracker activityTracker;
    private final ErrorCounter errorCounter;

    public AdminStatsService(UserRepository userRepository, ActivityTracker activityTracker, ErrorCounter errorCounter) {
        this.userRepository = userRepository;
        this.activityTracker = activityTracker;
        this.errorCounter = errorCounter;
    }

    @Transactional(readOnly = true)
    public AdminStatsDTO getStats() {
        long totalUsers = userRepository.count();
        long newUsersToday = userRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay());

        List<SystemEventDTO> events = userRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(this::toRegistrationEvent)
                .toList();

        return new AdminStatsDTO(
                totalUsers,
                newUsersToday,
                currentLoad(),
                errorCounter.get(),
                activityTracker.countActiveUsers(),
                events
        );
    }

    private SystemEventDTO toRegistrationEvent(User user) {
        return new SystemEventDTO(
                user.getId(),
                "User registered",
                user.getUsername(),
                user.getCreatedAt() != null ? user.getCreatedAt().format(EVENT_TIME) : "-"
        );
    }

    /** System load average relative to the number of CPUs, e.g. "35%"; "N/A" where the OS does not report it. */
    private String currentLoad() {
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
        double load = os.getSystemLoadAverage();
        if (load < 0) return "N/A";
        int percent = (int) Math.round(load / os.getAvailableProcessors() * 100);
        return percent + "%";
    }
}
