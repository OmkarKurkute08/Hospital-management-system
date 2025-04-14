package com.project.HmsApplication.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.HmsApplication.entity.Appointment;
import com.project.HmsApplication.entity.Prescription;
import com.project.HmsApplication.repository.AppointmentRepository;
import com.project.HmsApplication.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByUser(Long id){
        // Implementation to fetch prescriptions by user
        return prescriptionRepository.findByPatientId(id);
    }
    
    public List<Prescription> findPrescriptionsByUserId(Long id) {
        return prescriptionRepository.findByPatientId(id); // Assuming your repository has this method implemented
    }
    
    public Prescription prescribeMedication(Long appointmentId, String medication, String dosage, String instructions) {
        // First, find the appointment by the provided ID
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Create a new prescription
        Prescription prescription = new Prescription();
        prescription.setDoctor(appointment.getDoctor()); // Ensure that the Appointment entity has a doctor reference
        prescription.setPatient(appointment.getPatient()); // Ensure that the Appointment entity has a patient reference
        prescription.setAppointment(appointment);
        prescription.setMedication(medication);
        prescription.setDosage(dosage);
        prescription.setInstructions(instructions);
        prescription.setPrescribedAt(new Date()); // Set the current date as the prescribed date

        // Save the prescription to the database
        return prescriptionRepository.save(prescription);
    }
    public List<Prescription> findPrescriptionsByAppointmentId(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId); // Assuming your repository has this method implemented
    }
}