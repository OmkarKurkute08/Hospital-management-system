package com.project.HmsApplication.entity;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Doctor extends User {
    private Integer experience;
    private String doctorDepartment; // Ensure this field exists
    private String docAvatar;
}