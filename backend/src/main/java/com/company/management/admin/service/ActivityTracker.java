package com.company.management.admin.service;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Remembers when each user last made an authenticated request.
 * The API is stateless (JWT), so "active sessions" is approximated as
 * users seen within the last {@link #ACTIVE_WINDOW}.
 */
@Component
public class ActivityTracker {

    static final Duration ACTIVE_WINDOW = Duration.ofMinutes(15);

    private final Map<Long, Instant> lastSeen = new ConcurrentHashMap<>();

    public void recordActivity(Long userId) {
        lastSeen.put(userId, Instant.now());
    }

    public int countActiveUsers() {
        Instant threshold = Instant.now().minus(ACTIVE_WINDOW);
        lastSeen.values().removeIf(seen -> seen.isBefore(threshold));
        return lastSeen.size();
    }
}
