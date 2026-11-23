package com.company.management.admin.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class MaintenanceModeService {

    private final AtomicBoolean enabled = new AtomicBoolean(false);

    public boolean isEnabled() {
        return enabled.get();
    }

    /** Flips the flag atomically and returns the new state. */
    public boolean toggle() {
        while (true) {
            boolean current = enabled.get();
            if (enabled.compareAndSet(current, !current)) {
                return !current;
            }
        }
    }
}
