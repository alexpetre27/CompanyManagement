package com.company.management.security;

import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Used by the login flow: accepts either a username or an e-mail address.
     * E-mails are matched case-insensitively, consistent with registration's uniqueness check.
     */
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String value = identifier == null ? "" : identifier.trim();
        User user = (value.contains("@")
                ? userRepository.findByEmailIgnoreCase(value)
                : userRepository.findByUsername(value))
                .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        return toUserDetails(user);
    }

    /** Used by the JWT filter, whose tokens carry the user id. */
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User no longer exists"));
        return toUserDetails(user);
    }

    private UserDetails toUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())))
                .build();
    }
}
