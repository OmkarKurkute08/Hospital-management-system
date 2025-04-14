package com.project.HmsApplication.repository;

import java.util.List;
import com.project.HmsApplication.entity.Prescription;


import org.springframework.data.jpa.repository.JpaRepository;



public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

	List<Prescription> findByPatientId(Long id);
	List<Prescription> findByAppointmentId(Long appointmentId); // Add this method
}