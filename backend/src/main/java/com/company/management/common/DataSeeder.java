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
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("alex_petre43");
            admin.setEmail("petrealexandru1152@gmail.com");
            admin.setPassword(passwordEncoder.encode("parola123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User dev1 = new User();
            dev1.setUsername("ion_popescu");
            dev1.setEmail("ion.popescu@company.com");
            dev1.setPassword(passwordEncoder.encode("parola123"));
            dev1.setRole("USER");
            userRepository.save(dev1);

            User dev2 = new User();
            dev2.setUsername("elena_radua");
            dev2.setEmail("elena.radua@company.com");
            dev2.setPassword(passwordEncoder.encode("parola123"));
            dev2.setRole("USER");
            userRepository.save(dev2);
        }
    }

    private void seedProjects() {
        if (microserviceRepository.count() == 0) {
            Microservice m1 = new Microservice();
            m1.setName("Management System");
            m1.setVersion("v2.1.0");
            m1.setStatus("ACTIVE");
            m1.setPort(8080);
            m1.setUptime("12 days");
            m1.setDescription("SaaS dashboard for agile teams. Built with Spring Boot and Next.js.");
            m1.setRepoUrl("https://github.com/alex/management-system");
            m1.setLiveUrl("http://localhost:3000");
            m1.setTechStack(Arrays.asList("Java", "Spring Boot", "Next.js", "PostgreSQL"));

            Microservice m2 = new Microservice();
            m2.setName("E-commerce API");
            m2.setVersion("v1.5.2");
            m2.setStatus("ACTIVE");
            m2.setPort(5000);
            m2.setUptime("45 days");
            m2.setDescription("Scalable REST API for online stores. High availability architecture.");
            m2.setRepoUrl("https://github.com/alex/ecommerce-api");
            m2.setLiveUrl("https://api.store.com");
            m2.setTechStack(Arrays.asList("Python", "FastAPI", "Redis", "MongoDB"));

            Microservice m3 = new Microservice();
            m3.setName("Legacy CRM");
            m3.setVersion("v0.9.beta");
            m3.setStatus("ON_HOLD");
            m3.setPort(9090);
            m3.setUptime("0 days");
            m3.setDescription("Internal tool in maintenance mode while migrating to cloud.");
            m3.setLiveUrl("http://internal-crm.local");
            m3.setTechStack(Arrays.asList("PHP", "Laravel", "MySQL", "jQuery"));

            Microservice m4 = new Microservice();
            m4.setName("Analytics Engine");
            m4.setVersion("v3.0.1");
            m4.setStatus("ACTIVE");
            m4.setPort(7000);
            m4.setUptime("5 days");
            m4.setDescription("Service processing activity logs for actionable insights via ML.");
            m4.setRepoUrl("https://github.com/alex/analytics-engine");
            m4.setTechStack(Arrays.asList("Java", "Kafka", "Elasticsearch", "Spark"));

            microserviceRepository.saveAll(List.of(m1, m2, m3, m4));
        }
    }
}