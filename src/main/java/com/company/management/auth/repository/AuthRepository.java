package com.company.management.auth.repository;

import com.company.management.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
}