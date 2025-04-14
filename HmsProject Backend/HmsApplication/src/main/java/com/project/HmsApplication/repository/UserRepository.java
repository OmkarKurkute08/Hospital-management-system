package com.project.HmsApplication.repository;

import java.util.Optional; 

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.HmsApplication.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Only include methods relevant to the User entity

	Optional<User> findByEmailAndPasswordAndRole(String email, String password, String role);

	Optional<User> findByFirstNameAndLastName(String doctorFirstName, String doctorLastName);
}