package com.project.HmsApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.HmsApplication.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
	
}