package com.company.management.admin.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * While maintenance mode ("lockdown") is on, only administrators can use the API.
 * Login and the admin endpoints stay reachable so an admin can turn it off again.
 * Runs after JWT authentication, so the caller's role is already known.
 */
public class MaintenanceModeFilter extends OncePerRequestFilter {

    private final MaintenanceModeService maintenanceModeService;

    public MaintenanceModeFilter(MaintenanceModeService maintenanceModeService) {
        this.maintenanceModeService = maintenanceModeService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (maintenanceModeService.isEnabled() && isRestricted(request.getRequestURI()) && !isAdmin()) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"status\":503,\"error\":\"Service Unavailable\",\"message\":\"The system is in maintenance mode\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isRestricted(String path) {
        return path.startsWith("/api/")
                && !path.startsWith("/api/auth/")
                && !path.startsWith("/api/admin/")
                && !path.startsWith("/api/system/");
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
