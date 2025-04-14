package com.project.HmsApplication.dto;

import java.util.Date;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AppointmentRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private Date dob;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Appointment date is required")
    private Date appointmentDate;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Doctor's first name is required")
    private String doctorFirstName;

    @NotBlank(message = "Doctor's last name is required")
    private String doctorLastName;

    private Boolean hasVisited;

    @NotBlank(message = "Address is required")
    private String address;
}