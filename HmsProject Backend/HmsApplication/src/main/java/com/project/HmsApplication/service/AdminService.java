package com.project.HmsApplication.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.HmsApplication.entity.Admin;
import com.project.HmsApplication.repository.AdminRepository;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin addNewAdmin(String firstName, String lastName, String email, String phone, String password,
                             Integer age, Date dob, String gender) {
        Admin admin = new Admin();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setEmail(email);
        admin.setPhone(phone);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setDob(dob);
        admin.setGender(gender);
        admin.setRole("ADMIN");
        admin.setCreatedAt(new Date());
        return adminRepository.save(admin);
    }

	public Admin login(String email, String password, String role) {
		Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!admin.getRole().equals(role)) {
            throw new RuntimeException("Invalid role");
        }

        
		return admin;
	}

	public UserDetails loadUserByUsername(String email) {
		Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(admin.getEmail())
                .password(admin.getPassword())
                .roles(admin.getRole())
                .build();
	}

	public Admin getCurrentUser(String email) {
		return adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
	}
}