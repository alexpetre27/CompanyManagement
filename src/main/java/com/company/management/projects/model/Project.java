package com.company.management.projects.model;

import java.util.HashSet;

import java.util.Set;

import com.company.management.users.model.user;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
     @ManyToMany(mappedBy = "projects")
    private Set<user> users = new HashSet<>();

    public Project(){

    }
    public Project(String name) {
        this.name = name;
    }
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setUsers(Set<user> users) {
        this.users = users;
    }
    public Set<user> getUsers() {
        return users;
    }

   
}