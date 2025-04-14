package com.project.HmsApplication.dto;

import jakarta.validation.constraints.NotBlank;

public class PrescriptionRequest {

    @NotBlank(message = "Medication cannot be empty")
    private String medication;

    @NotBlank(message = "Dosage cannot be empty")
    private String dosage;

    @NotBlank(message = "Instructions cannot be empty")
    private String instructions;

    // Default constructor
    public PrescriptionRequest() {}

    // Parameterized constructor
    public PrescriptionRequest(String medication, String dosage, String instructions) {
        this.medication = medication;
        this.dosage = dosage;
        this.instructions = instructions;
    }

    // Getters and Setters
    public String getMedication() {
        return medication;
    }

    public void setMedication(String medication) {
        this.medication = medication;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}