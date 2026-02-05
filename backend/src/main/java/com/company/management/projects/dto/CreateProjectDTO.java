package com.company.management.projects.dto;

import java.util.List;

public class CreateProjectDTO {
    public String name;
    public String version;
    public Integer port;
    public String description;
    public String repoUrl;
    public String liveUrl;
    public List<String> techStack;
    public List<String> teamMembers;
}
