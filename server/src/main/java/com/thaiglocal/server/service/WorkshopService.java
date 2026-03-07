package com.thaiglocal.server.service;

import org.springframework.stereotype.Service;

import com.thaiglocal.server.repository.WorkshopRepository;

@Service
public class WorkshopService {
    private final WorkshopRepository workshopRepository;

    public WorkshopService(WorkshopRepository workshopRepository) {
        this.workshopRepository = workshopRepository;
    }

    
}
