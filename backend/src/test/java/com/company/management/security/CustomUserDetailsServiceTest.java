package com.company.management.security;

import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final CustomUserDetailsService service = new CustomUserDetailsService(userRepository);

    private static User user() {
        User user = new User();
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setPassword("hash");
        user.setRole("ADMIN");
        return user;
    }

    @Test
    void emailLoginIsCaseInsensitive() {
        when(userRepository.findByEmailIgnoreCase("Alice@Example.com")).thenReturn(Optional.of(user()));

        var details = service.loadUserByUsername("  Alice@Example.com ");

        assertThat(details.getUsername()).isEqualTo("alice");
        assertThat(details.getAuthorities()).extracting("authority").containsExactly("ROLE_ADMIN");
    }

    @Test
    void usernameLoginUsesUsernameLookup() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user()));

        assertThat(service.loadUserByUsername("alice").getUsername()).isEqualTo("alice");
        verify(userRepository, never()).findByEmailIgnoreCase(any());
    }

    @Test
    void unknownUserGivesGenericError() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("Invalid credentials");
    }

}
