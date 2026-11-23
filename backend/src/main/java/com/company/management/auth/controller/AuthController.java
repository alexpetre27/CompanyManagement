package com.company.management.auth.controller;

import com.company.management.auth.dto.AuthDTOs.LoginRequestDTO;
import com.company.management.auth.dto.AuthDTOs.LoginResponseDTO;
import com.company.management.auth.dto.AuthDTOs.SocialLoginRequestDTO;
import com.company.management.auth.service.AuthService;
import com.company.management.users.dto.UserDTOs.UserCreateRequestDTO;
import com.company.management.users.dto.UserDTOs.UserResponseDTO;
import com.company.management.users.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    static final String INTERNAL_SECRET_HEADER = "X-Internal-Secret";

    private final AuthService authService;
    private final UserService userService;
    private final byte[] internalApiSecret;

    public AuthController(AuthService authService,
                          UserService userService,
                          @Value("${app.internal-api-secret:}") String internalApiSecret) {
        this.authService = authService;
        this.userService = userService;
        this.internalApiSecret = internalApiSecret.getBytes(StandardCharsets.UTF_8);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserCreateRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerNewUser(dto));
    }

    /**
     * Exchanges an identity already verified by the Next.js server (Google OAuth) for a backend token.
     * The caller must present the shared INTERNAL_API_SECRET; otherwise anyone could log in as
     * any user just by knowing their e-mail address.
     */
    @PostMapping("/social")
    public ResponseEntity<LoginResponseDTO> socialLogin(
            @RequestHeader(value = INTERNAL_SECRET_HEADER, required = false) String providedSecret,
            @Valid @RequestBody SocialLoginRequestDTO dto) {
        if (!isTrustedCaller(providedSecret)) {
            throw new AccessDeniedException("Social login is only available to the trusted frontend server");
        }
        return ResponseEntity.ok(authService.socialLogin(dto));
    }

    private boolean isTrustedCaller(String providedSecret) {
        if (internalApiSecret.length == 0 || providedSecret == null) {
            return false;
        }
        return MessageDigest.isEqual(internalApiSecret, providedSecret.getBytes(StandardCharsets.UTF_8));
    }
}
