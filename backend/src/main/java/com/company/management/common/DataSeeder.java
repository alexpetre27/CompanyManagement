package com.company.management.common;

import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import com.company.management.users.model.ProjectRole;
import com.company.management.users.model.User;
import com.company.management.users.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final MicroserviceRepository microserviceRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminEmail;
    private final String adminPassword;
    private final boolean seedDemoData;

    public DataSeeder(UserRepository userRepository,
                      MicroserviceRepository microserviceRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.seed.admin-username:admin}") String adminUsername,
                      @Value("${app.seed.admin-email:admin@company.local}") String adminEmail,
                      @Value("${app.seed.admin-password:}") String adminPassword,
                      @Value("${app.seed.demo-data:true}") boolean seedDemoData) {
        this.userRepository = userRepository;
        this.microserviceRepository = microserviceRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.seedDemoData = seedDemoData;
    }

    @Override
    @Transactional
    public void run(String... args) {
        repairLegacyRoles();
        seedUsers();
        if (seedDemoData) {
            seedProjects();
        }
    }

    /**
     * Older versions of the UI wrote project roles ("ROLE_USER", "ROLE_MANAGER", ...) into the
     * system role column, which locked those users out ("ROLE_ROLE_MANAGER" matches nothing).
     * Normalise them back to USER/ADMIN and keep the project role separately.
     */
    private void repairLegacyRoles() {
        List<User> repaired = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            String role = user.getRole() == null ? "" : user.getRole().toUpperCase(Locale.ROOT);
            if ("USER".equals(role) || "ADMIN".equals(role)) continue;

            String stripped = role.startsWith("ROLE_") ? role.substring(5) : role;
            user.setRole("ADMIN".equals(stripped) ? "ADMIN" : "USER");
            if (user.getProjectRole() == null) {
                switch (stripped) {
                    case "MANAGER" -> user.setProjectRole(ProjectRole.MANAGER);
                    case "DESIGNER" -> user.setProjectRole(ProjectRole.DESIGNER);
                    default -> { if (user.getProject() != null) user.setProjectRole(ProjectRole.DEVELOPER); }
                }
            }
            repaired.add(user);
        }
        if (!repaired.isEmpty()) {
            userRepository.saveAll(repaired);
            log.info("Repaired the system role of {} user(s)", repaired.size());
        }
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        String password = adminPassword;
        if (password == null || password.isBlank()) {
            byte[] bytes = new byte[18];
            new SecureRandom().nextBytes(bytes);
            password = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            log.warn("ADMIN_PASSWORD is not set. Generated initial password for '{}': {}  (change it after logging in)",
                    adminUsername, password);
        }

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        userRepository.save(admin);
        log.info("Created initial administrator '{}'", adminUsername);
    }

    private void seedProjects() {
        if (microserviceRepository.count() > 0) return;

        Microservice m1 = project("Management System", "v2.1.0", "ACTIVE", 8080, "12 days",
                "SaaS dashboard for agile teams. Built with Spring Boot and Next.js.",
                "https://github.com/alex/management-system", "http://localhost:3000",
                List.of("Java", "Spring Boot", "Next.js", "PostgreSQL"));
        Microservice m2 = project("E-commerce API", "v1.5.2", "ACTIVE", 5000, "45 days",
                "Scalable REST API for online stores. High availability architecture.",
                "https://github.com/alex/ecommerce-api", "https://api.store.com",
                List.of("Python", "FastAPI", "Redis", "MongoDB"));
        Microservice m3 = project("Legacy CRM", "v0.9.beta", "ON_HOLD", 9090, "0 days",
                "Internal tool in maintenance mode while migrating to cloud.",
                null, "http://internal-crm.local",
                List.of("PHP", "Laravel", "MySQL", "jQuery"));
        Microservice m4 = project("Analytics Engine", "v3.0.1", "ACTIVE", 7000, "5 days",
                "Service processing activity logs for actionable insights via ML.",
                "https://github.com/alex/analytics-engine", null,
                List.of("Java", "Kafka", "Elasticsearch", "Spark"));

        microserviceRepository.saveAll(List.of(m1, m2, m3, m4));
    }

    private static Microservice project(String name, String version, String status, int port, String uptime,
                                        String description, String repoUrl, String liveUrl, List<String> techStack) {
        Microservice m = new Microservice();
        m.setName(name);
        m.setVersion(version);
        m.setStatus(status);
        m.setPort(port);
        m.setUptime(uptime);
        m.setDescription(description);
        m.setRepoUrl(repoUrl);
        m.setLiveUrl(liveUrl);
        m.setTechStack(new ArrayList<>(techStack));
        return m;
    }
}
