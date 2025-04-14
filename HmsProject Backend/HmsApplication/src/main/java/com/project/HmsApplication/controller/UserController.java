package com.project.HmsApplication.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.HmsApplication.dto.LoginRequest;
import com.project.HmsApplication.entity.Appointment;
import com.project.HmsApplication.entity.Doctor;
import com.project.HmsApplication.entity.Prescription;
import com.project.HmsApplication.entity.User;
import com.project.HmsApplication.repository.DoctorRepository;
import com.project.HmsApplication.service.AppointmentService;
import com.project.HmsApplication.service.DoctorService;
import com.project.HmsApplication.service.PrescriptionService;
import com.project.HmsApplication.service.UserService;
import com.project.HmsApplication.util.JwtUtil;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private PrescriptionService prescriptionService;
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private DoctorRepository doctorRepository; 	

    @PostMapping("/patient/register")
    public ResponseEntity<User> registerPatient(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerPatient(user));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword(), request.getRole());
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/patient/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam String email) {
        return ResponseEntity.ok(userService.getCurrentUser(email));
    }

    @GetMapping("/patient/logout")
    public ResponseEntity<String> logout(@RequestParam String email) {
        userService.logout(email);
        return ResponseEntity.ok("Logged out successfully");
    }
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }
    @GetMapping("/doctors/{department}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(doctorRepository.findByRoleAndDoctorDepartment("Doctor", department));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByUser(userId));
    }
    @GetMapping("/user/{id}/all")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long id) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(id);
        return ResponseEntity.ok(appointments);
    }
    @GetMapping("/doctors/count")
    public ResponseEntity<Map<String, Long>> getDoctorCount() {
        long count = doctorService.countDoctors();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/prescription/{appointmentId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByAppointmentId(@PathVariable Long appointmentId) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionsByAppointmentId(appointmentId);
        return ResponseEntity.ok(prescriptions);
    }
}