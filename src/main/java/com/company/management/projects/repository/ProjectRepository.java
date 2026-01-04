package com.company.management.projects.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.management.projects.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    
}