package com.company.management.users.repository;

import com.company.management.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmailIgnoreCase(String email);
    List<User> findByUsernameIn(List<String> usernames);
    List<User> findTop5ByOrderByCreatedAtDesc();

    boolean existsByUsername(String username);
    boolean existsByEmailIgnoreCase(String email);

    long countByCreatedAtAfter(LocalDateTime since);
}
