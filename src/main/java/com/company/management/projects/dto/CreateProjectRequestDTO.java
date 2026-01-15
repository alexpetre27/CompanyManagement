package com.company.management.projects.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateProjectRequestDTO {
    @NotBlank
    public String name;
    public String description;
}
