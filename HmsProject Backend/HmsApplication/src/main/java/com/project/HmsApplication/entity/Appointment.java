package com.project.HmsApplication.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    private Date appointmentDate;
    private String department;
    private Boolean hasVisited;
    private String address;
    private Date createdAt;
    
    private String status; // Added status field

    // Getters and setters
    public Boolean getHasVisited() {
        return hasVisited;
    }
    
    public void setHasVisited(Boolean hasVisited) {
        this.hasVisited = hasVisited;
    }
    
}