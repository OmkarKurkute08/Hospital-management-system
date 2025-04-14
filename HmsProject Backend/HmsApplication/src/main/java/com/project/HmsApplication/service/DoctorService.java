package com.project.HmsApplication.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.project.HmsApplication.entity.Doctor;
import com.project.HmsApplication.repository.DoctorRepository;

@Service
public class DoctorService implements UserDetailsService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    public Doctor addNewDoctor(String firstName, String lastName, String email, String phone, String password,
            Integer experience, Date dob, String gender, String doctorDepartment, MultipartFile docAvatar) throws IOException {
        
        // Save avatar to Cloudinary and get the URL
        String avatarFileName = saveAvatar(docAvatar);

        Doctor doctor = new Doctor();
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setPassword(passwordEncoder.encode(password));
        doctor.setExperience(experience);
        doctor.setDob(dob);
        doctor.setGender(gender);
        doctor.setRole("DOCTOR");
        doctor.setDoctorDepartment(doctorDepartment);
        doctor.setDocAvatar(avatarFileName); // This will be the Cloudinary URL
        doctor.setCreatedAt(new Date());

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getDoctorsByDepartment(String department) {
        return doctorRepository.findByDoctorDepartment(department);
    }

    private String saveAvatar(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // Return null if the file is empty or null
        }

        // Upload the image to Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of());
        return (String) uploadResult.get("url"); // Get the URL of the uploaded file
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(doctor.getEmail())
                .password(doctor.getPassword())
                .roles(doctor.getRole())
                .build();
    }

    public Doctor login(String email, String password, String role) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!doctor.getRole().equals(role)) {
            throw new RuntimeException("Invalid role");
        }

        return doctor;
    }

    public Doctor getCurrentUser(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public int countDoctors() {
        return (int) doctorRepository.count();
    }
}