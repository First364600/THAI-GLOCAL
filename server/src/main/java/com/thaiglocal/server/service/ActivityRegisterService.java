package com.thaiglocal.server.service;

import org.springframework.stereotype.Service;

import com.thaiglocal.server.repository.ActivityRegisterRepository;

@Service
public class ActivityRegisterService {
    private final ActivityRegisterRepository activityRegisterRepository;

    public ActivityRegisterService(ActivityRegisterRepository activityRegisterRepository) {
        this.activityRegisterRepository = activityRegisterRepository;
    }

    
}
