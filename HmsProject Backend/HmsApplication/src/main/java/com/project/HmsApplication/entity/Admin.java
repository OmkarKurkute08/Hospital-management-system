package com.project.HmsApplication.entity;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {
    // Additional fields specific to Admin
    private String adminId; // Example: Custom admin ID
}