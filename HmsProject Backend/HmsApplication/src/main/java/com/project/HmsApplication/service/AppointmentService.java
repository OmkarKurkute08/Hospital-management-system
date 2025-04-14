package com.project.HmsApplication.service;

import java.util.Date;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.HmsApplication.dto.AppointmentRequest;
import com.project.HmsApplication.entity.Appointment;
import com.project.HmsApplication.entity.Prescription;
import com.project.HmsApplication.entity.User;
import com.project.HmsApplication.repository.AppointmentRepository;
import com.project.HmsApplication.repository.PrescriptionRepository;
import com.project.HmsApplication.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(AppointmentRequest request) {
        // Find patient
        User patient = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Find doctor
        User doctor = userRepository.findByFirstNameAndLastName(request.getDoctorFirstName(), request.getDoctorLastName())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDepartment(request.getDepartment());
        appointment.setHasVisited(request.getHasVisited());
        appointment.setAddress(request.getAddress());
        appointment.setCreatedAt(new Date());

        return appointmentRepository.save(appointment);
    }

    // Update appointment status and create a prescription if applicable
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        // Find the appointment by ID
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        // Update the status
        appointment.setStatus(status);

        // Check if appointment is completed and create a prescription
        if ("COMPLETED".equalsIgnoreCase(status)) {
            Prescription prescription = new Prescription();
            prescription.setDoctor(appointment.getDoctor());
            prescription.setPatient(appointment.getPatient());
            prescription.setMedication("Medication Name"); // This should be provided during the update
            prescription.setDosage("Dosage Information"); // This should also be user input
            prescription.setInstructions("Detailed instructions about the medication.");
            prescription.setPrescribedAt(new Date());

            prescriptionRepository.save(prescription);
        }

        // Save the updated appointment
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

//    public List<Appointment> getAllAppointmentsById(Long id) {
//        return appointmentRepository.findById(id);
//    }


    public Appointment updateAppointment(Long appointmentId, AppointmentRequest request) {
        // Find the existing appointment by ID
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Update the appointment fields based on the request
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDepartment(request.getDepartment());

        // Set doctor details from the request
        appointment.getDoctor().setFirstName(request.getDoctorFirstName());
        appointment.getDoctor().setLastName(request.getDoctorLastName());

        // Update the hasVisited flag
        appointment.setHasVisited(request.getHasVisited()); // Corrected this line

        appointment.setAddress(request.getAddress());

        // Save the updated appointment
        return appointmentRepository.save(appointment);
    }

    public int countAppointments() {
        return (int) appointmentRepository.count();
    }

    public List<Appointment> getAppointmentsByUserId(Long id) {
        return appointmentRepository.findByPatient_Id(id);  // Assuming the repository has this method implemented
    }

    public List<Appointment> getAppointmentsByDoctorId(Long id) {
        return appointmentRepository.findByDoctor_Id(id);
    }

    // New Method: GET appointment by ID
    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElse(null); // Return null if not found (controller handles 404)
    }

    // New Method: PUT to reschedule appointment
    public Appointment rescheduleAppointment(Long appointmentId, AppointmentRequest request) {
         Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

        // Find doctor
        User doctor = userRepository.findByFirstNameAndLastName(request.getDoctorFirstName(), request.getDoctorLastName())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update the appointment fields based on the request
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDepartment(request.getDepartment());
        appointment.setDoctor(doctor); // Assuming you want to update the doctor
        appointment.setHasVisited(request.getHasVisited());
        appointment.setAddress(request.getAddress());

        // Set the status to "PENDING"
        appointment.setStatus("PENDING");  // Added this line

        return appointmentRepository.save(appointment);
    }
}