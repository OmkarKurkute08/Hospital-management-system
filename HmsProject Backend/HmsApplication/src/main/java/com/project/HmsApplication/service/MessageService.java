package com.project.HmsApplication.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.HmsApplication.dto.MessageRequest;
import com.project.HmsApplication.entity.Message;
import com.project.HmsApplication.repository.MessageRepository;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(MessageRequest request) {
        Message message = new Message();
        message.setFirstName(request.getFirstName());
        message.setLastName(request.getLastName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setMessage(request.getMessage());
        message.setCreatedAt(new Date());

        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
}