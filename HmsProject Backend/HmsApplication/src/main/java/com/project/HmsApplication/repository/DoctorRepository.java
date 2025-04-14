package com.project.HmsApplication.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.HmsApplication.entity.Doctor;
//import com.zeecare.hms2.entity.User;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByRoleAndDoctorDepartment(String role, String department); // Move doctor-specific queries here

	List<Doctor> findByDoctorDepartment(String department);

	Optional<Doctor> findByFirstNameAndLastName(String doctorFirstName, String doctorLastName);

	Optional <Doctor> findByEmail(String email);
}