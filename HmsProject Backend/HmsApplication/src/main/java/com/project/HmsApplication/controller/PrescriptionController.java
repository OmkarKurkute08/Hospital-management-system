package com.project.HmsApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.project.HmsApplication.entity.Prescription;
import com.project.HmsApplication.service.PrescriptionService;


@RestController
@RequestMapping("/api/v1/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/add")
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescription));
    }

//    @GetMapping("/user/{id}")
//    public ResponseEntity<List<Prescription>> getPrescriptionsByUser(@PathVariable Long id) {
//        return ResponseEntity.ok(prescriptionService.getPrescriptionsByUser(id));
//    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByUserId(@PathVariable Long id) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionsByUserId(id);
        return ResponseEntity.ok(prescriptions);
    }
    @GetMapping("/{appointmentId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByAppointmentId(@PathVariable Long appointmentId) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionsByAppointmentId(appointmentId);
        return ResponseEntity.ok(prescriptions);
    }
}