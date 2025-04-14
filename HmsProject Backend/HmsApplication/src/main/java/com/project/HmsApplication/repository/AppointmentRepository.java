package com.project.HmsApplication.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.HmsApplication.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	@Query("SELECT a FROM Appointment a WHERE a.status = ?1")
	List<Appointment> findAppointmentsByStatus(String status);
	List<Appointment> findByPatient_Id(Long id);
	List<Appointment> findByDoctor_Id(Long id);

}