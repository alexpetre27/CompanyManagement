package com.company.management.common;

import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, 
                      MicroserviceRepository microserviceRepository, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedProjects();
    }

    private void seedUsers() {
        String email = "petrealexandru1152@gmail.com"; 
        
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setUsername("alex_petre43"); 
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("parola123")); 
            user.setRole("ADMIN");
            
            userRepository.save(user);
            System.out.println(">>> DataSeeder: User 'alex_petre43' created successfully!");
        }
    }

    private void seedProjects() {
        if (microserviceRepository.count() == 0) {
            System.out.println(">>> DataSeeder: Seeding projects...");

            Microservice m1 = new Microservice(
                "Management System",
                "v2.1.0",
                "active",
                8080,
                "A comprehensive SaaS dashboard for managing agile teams and microservices. " +
                "Features include real-time analytics, user management, and project tracking. " +
                "Built with a robust Java Spring Boot backend and a modern Next.js frontend.",
                "https://github.com/alex/management-system",
                "http://localhost:3000",
                Arrays.asList("Java", "Spring Boot", "Next.js", "PostgreSQL", "Docker"),
                 null
            );

            Microservice m2 = new Microservice(
                "E-commerce API",
                "v1.5.2",
                "active",
                5000,
                "Scalable REST API for a high-traffic online store. Handles inventory management, " +
                "order processing, and payment gateway integration (Stripe & PayPal). " +
                "Optimized for high availability and low latency.",
                "https://github.com/alex/ecommerce-api",
                "https://api.store.com",
                Arrays.asList("Python", "FastAPI", "Redis", "MongoDB", "AWS"),
                null
            );

            Microservice m3 = new Microservice(
                "Legacy CRM",
                "v0.9.beta",
                "on_hold",
                9090,
                "Internal Customer Relationship Management tool. Currently in maintenance mode " +
                "while migrating to the new cloud architecture. Contains historical client data.",
                null, 
                "http://internal-crm.local",
                Arrays.asList("PHP", "Laravel", "MySQL", "jQuery"), null
            );

            Microservice m4 = new Microservice(
                "Data Analytics Engine",
                "v3.0.1",
                "active",
                7000,
                "Background service that processes user activity logs to generate actionable insights. " +
                "Uses machine learning models to predict server load and user retention.",
                "https://github.com/alex/analytics-engine",
                null,
                Arrays.asList("Java", "Kafka", "Elasticsearch", "Spark"), null
            );

            microserviceRepository.saveAll(List.of(m1, m2, m3, m4));
            System.out.println(">>> DataSeeder: 4 Projects created!");
        }
    }
}