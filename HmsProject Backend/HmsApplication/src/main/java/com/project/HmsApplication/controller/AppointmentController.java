package com.project.HmsApplication.controller;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.HmsApplication.dto.AppointmentRequest;
import com.project.HmsApplication.entity.Appointment;
import com.project.HmsApplication.entity.Prescription;
import com.project.HmsApplication.service.AppointmentService;
import com.project.HmsApplication.service.PrescriptionService;

@RestController
@RequestMapping("/api/v1/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/post")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/user/{userId}/all")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/updateStatus/{appointmentId}")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestParam String status) {
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @GetMapping("/user/{userId}/prescriptions")
    public ResponseEntity<List<Prescription>> getUserPrescriptions(@PathVariable Long userId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByUser(userId);
        return ResponseEntity.ok(prescriptions);
    }

    // New Endpoint: GET appointment by ID
    @GetMapping("/{appointmentId}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    // New Endpoint: PUT to reschedule appointment
    @PutMapping("/reschedule/{appointmentId}")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestBody AppointmentRequest request) {
        try {
            Appointment rescheduledAppointment = appointmentService.rescheduleAppointment(appointmentId, request);
            return ResponseEntity.ok(rescheduledAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or another appropriate error response
        }
    }
}