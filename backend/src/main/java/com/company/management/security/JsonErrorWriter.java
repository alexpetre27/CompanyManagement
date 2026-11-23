package com.company.management.security;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

/**
 * Writes error bodies from filters, where the MVC exception handler is not reachable.
 * Only fixed, server-controlled strings are written, so no escaping of user input is needed;
 * the path is still escaped defensively.
 */
final class JsonErrorWriter {

    private JsonErrorWriter() {}

    static void write(HttpServletResponse response, int status, String error, String message, String path)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now()
                + "\",\"status\":" + status
                + ",\"error\":\"" + error
                + "\",\"message\":\"" + message
                + "\",\"path\":\"" + escape(path) + "\"}");
    }

    private static String escape(String value) {
        if (value == null) return "";
        StringBuilder sb = new StringBuilder(value.length());
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                default -> {
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}
