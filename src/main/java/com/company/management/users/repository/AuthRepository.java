package com.company.management.users.repository;

import com.company.management.users.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AuthRepository extends JpaRepository<user, Long>{
    Optional<user> findByUsername(String username);
}