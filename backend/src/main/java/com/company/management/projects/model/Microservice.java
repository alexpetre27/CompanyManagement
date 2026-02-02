package com.company.management.projects.model;

import jakarta.persistence.*;

@Entity
@Table(name = "microservices")

public class Microservice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String status; 
    private String version;
    private String url;
    private String port;
    private String uptime;

    public Microservice() {}
    public Microservice(String name) {
        this.name = name;
        this.status = "inactive";
        this.version = "1.0.0";
        this.url = "http://localhost";
        this.port = "8080";
        this.uptime = "0 days";
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getStatus() { return status; }
    public String getVersion() { return version; }
    public String getUrl() { return url; }
    public String getPort() { return port; }
    public String getUptime() { return uptime; }
    public void setName(String name) { this.name = name; }
    public void setStatus(String status) { this.status = status; }
    public void setVersion(String version) { this.version = version; }
    public void setUrl(String url) { this.url = url; }
    public void setPort(String port) { this.port = port; }
    public void setUptime(String uptime) { this.uptime = uptime; }

}