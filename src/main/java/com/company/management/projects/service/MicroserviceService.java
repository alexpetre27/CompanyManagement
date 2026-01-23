package com.company.management.projects.service;

import com.company.management.projects.model.Microservice;
import com.company.management.projects.repository.MicroserviceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MicroserviceService {
    private final MicroserviceRepository repository;

    public MicroserviceService(MicroserviceRepository repository) {
        this.repository = repository;
    }

    public List<Microservice> getAllServices() {
        return repository.findAll();
    }

    public void restartService(Long id) {
        Microservice service = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        
        System.out.println("Se restartează serviciul: " + service.getName());
        service.setStatus("STARTING");
        repository.save(service);
    }
}