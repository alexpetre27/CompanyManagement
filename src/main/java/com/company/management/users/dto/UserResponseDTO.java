package com.company.management.users.dto;

import java.util.List;

public class UserResponseDTO {
    public Long id;
    public String username;
    public String email;
    public List<Long> projectIds;
}