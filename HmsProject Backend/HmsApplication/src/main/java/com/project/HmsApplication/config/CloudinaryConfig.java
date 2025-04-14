package com.project.HmsApplication.config;

import java.util.HashMap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        HashMap<String, String> config = new HashMap<>();
        config.put("cloud_name", "dua3xv7kf");
        config.put("api_key", "191715725621612");
        config.put("api_secret", "6erhi7l1YHMNck9b4jdYxV86t8s");

        return new Cloudinary(config);
    }
}