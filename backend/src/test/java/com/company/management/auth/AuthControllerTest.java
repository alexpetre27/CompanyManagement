package com.company.management.auth;

import com.company.management.auth.controller.AuthController;
import com.company.management.auth.dto.AuthDTOs.LoginResponseDTO;
import com.company.management.auth.dto.AuthDTOs.SocialLoginRequestDTO;
import com.company.management.auth.service.AuthService;
import com.company.management.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private final AuthService authService = mock(AuthService.class);
    private final SocialLoginRequestDTO request = new SocialLoginRequestDTO("admin@example.com", "admin", null);

    @Test
    void socialLoginWithoutSecretIsRejected() {
        AuthController controller = new AuthController(authService, mock(UserService.class), "s3cret-shared-value");

        assertThatThrownBy(() -> controller.socialLogin(null, request)).isInstanceOf(AccessDeniedException.class);
        assertThatThrownBy(() -> controller.socialLogin("wrong", request)).isInstanceOf(AccessDeniedException.class);
        verify(authService, never()).socialLogin(any());
    }

    @Test
    void socialLoginIsDisabledWhenNoSecretIsConfigured() {
        AuthController controller = new AuthController(authService, mock(UserService.class), "");

        assertThatThrownBy(() -> controller.socialLogin("", request)).isInstanceOf(AccessDeniedException.class);
        verify(authService, never()).socialLogin(any());
    }

    @Test
    void socialLoginWithCorrectSecretIsAccepted() {
        LoginResponseDTO response = new LoginResponseDTO("token", 1000, "admin", "admin@example.com", "ADMIN", null);
        when(authService.socialLogin(request)).thenReturn(response);
        AuthController controller = new AuthController(authService, mock(UserService.class), "s3cret-shared-value");

        assertThat(controller.socialLogin("s3cret-shared-value", request).getBody()).isEqualTo(response);
    }
}
