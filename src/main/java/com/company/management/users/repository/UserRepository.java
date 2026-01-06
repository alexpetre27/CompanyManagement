package com.company.management.users.repository;

import com.company.management.users.model.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<user, Long>{
    Optional<user> findByUsername(String username);
    Optional<user> findByEmail(String email);
    
}