package com.company.management.common.exception;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

/** Counts unexpected server errors (HTTP 500) since startup; surfaced on the admin dashboard. */
@Component
public class ErrorCounter {

    private final AtomicLong count = new AtomicLong();

    public void increment() {
        count.incrementAndGet();
    }

    public long get() {
        return count.get();
    }
}
