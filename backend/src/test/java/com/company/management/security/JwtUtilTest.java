package com.company.management.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtUtilTest {

    private static final String SECRET = "test-secret-that-is-long-enough-for-hs256!!";

    @Test
    void refusesToStartWithoutAStrongSecret() {
        assertThatThrownBy(() -> new JwtUtil("", 1000)).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> new JwtUtil("too-short", 1000)).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void tokenRoundTripsTheUserId() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 60_000);

        assertThat(jwtUtil.extractUserId(jwtUtil.generateToken(42L))).isEqualTo(42L);
    }

    @Test
    void tokenSignedWithAnotherKeyIsRejected() {
        String foreign = new JwtUtil("another-secret-that-is-long-enough-for-hs256", 60_000).generateToken(1L);

        assertThatThrownBy(() -> new JwtUtil(SECRET, 60_000).extractUserId(foreign)).isInstanceOf(Exception.class);
    }

    @Test
    void expiredTokenIsRejected() {
        String expired = new JwtUtil(SECRET, -1_000).generateToken(1L);

        assertThatThrownBy(() -> new JwtUtil(SECRET, 60_000).extractUserId(expired)).isInstanceOf(Exception.class);
    }
}
