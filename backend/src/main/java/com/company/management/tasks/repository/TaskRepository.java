package com.company.management.tasks.repository;

import com.company.management.tasks.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByOwnerEmailIgnoreCaseOrderByIdDesc(String ownerEmail);

    Optional<Task> findByIdAndOwnerEmailIgnoreCase(Long id, String ownerEmail);

    @Modifying
    @Query("update Task t set t.ownerEmail = :newEmail where lower(t.ownerEmail) = lower(:oldEmail)")
    int reassignOwner(@Param("oldEmail") String oldEmail, @Param("newEmail") String newEmail);
}
