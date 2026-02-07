package com.company.management.projects.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "microservices")
@EntityListeners(AuditingEntityListener.class)
public class Microservice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String version;
    private String status;
    private Integer port;
    private String uptime;

    @Column(length = 2000)
    private String description;
    
    private String repoUrl;
    private String liveUrl;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "microservice_tech_stack", joinColumns = @JoinColumn(name = "microservice_id"))
    @Column(name = "technology")
    private List<String> techStack = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "microservice_team", joinColumns = @JoinColumn(name = "microservice_id"))
    @Column(name = "member_name")
    private List<String> teamMembers = new ArrayList<>();

    public Microservice() {}

    public Microservice(String name, String version, String status, Integer port, 
                        String description, String repoUrl, String liveUrl, List<String> techStack, List<String> teamMembers) {
        this.name = name;
        this.version = version;
        this.status = status;
        this.port = port;
        this.uptime = "0 days";
        this.description = description;
        this.repoUrl = repoUrl;
        this.liveUrl = liveUrl;
        this.techStack = techStack;
        this.teamMembers = teamMembers;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPort() { return port; }
    public void setPort(Integer port) { this.port = port; }

    public String getUptime() { return uptime; }
    public void setUptime(String uptime) { this.uptime = uptime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getTechStack() { return techStack; }
    public void setTechStack(List<String> techStack) { this.techStack = techStack; }

    public List<String> getTeamMembers() { return teamMembers; }
    public void setTeamMembers(List<String> teamMembers) { this.teamMembers = teamMembers; }
}