package com.thaiglocal.server.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thaiglocal.server.dto.request.ActivityRegisterRequest;
import com.thaiglocal.server.dto.response.ActivityRegisterReponse;
import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.ActivityRegister;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.ActivityRegisterStatus;
import com.thaiglocal.server.repository.ActivityRegisterRepository;
import com.thaiglocal.server.repository.ActivityRepository;
import com.thaiglocal.server.repository.UserRepository;

@Service
public class ActivityRegisterService {
    private final ActivityRegisterRepository activityRegisterRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public ActivityRegisterService(
        ActivityRegisterRepository activityRegisterRepository,
        UserRepository userRepository,
        ActivityRepository activityRepository
    ) {
        this.activityRegisterRepository = activityRegisterRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    private ActivityRegisterReponse mapToActivityRegisterResponse(ActivityRegister activityRegister) {
        return ActivityRegisterReponse.builder()
                .activityRegisterId(activityRegister.getActivityRegisterId())
                .username(activityRegister.getUser().getUsername())
                .numberOfRegister(activityRegister.getNumberOfRegister())
                .status(activityRegister.getStatus())
                .totalPrice(activityRegister.getNumberOfRegister() * activityRegister.getActivity().getPrice())
                .build();
    }

    private List<ActivityRegisterReponse> mapToActivityRegisterResponseList(List<ActivityRegister> activities) {
        return activities.stream()
                .map(this::mapToActivityRegisterResponse)
                .toList();
    }

    public List<ActivityRegisterReponse> getActivityRegistersByActivityId(Long activityId) {
        List<ActivityRegister> activitieRegisters = activityRegisterRepository.findByActivity_ActivityId(activityId);
        return mapToActivityRegisterResponseList(activitieRegisters);
    }

    public List<ActivityRegisterReponse> getActivityRegistersByUserId(String userId) {
        List<ActivityRegister> activitieRegisters = activityRegisterRepository.findByUser_UserId(userId);
        return mapToActivityRegisterResponseList(activitieRegisters);
    }

    public ActivityRegisterReponse getActivityRegisterById(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));
        return mapToActivityRegisterResponse(activityRegister);
    }

    public List<ActivityRegisterReponse> getAllActivityRegisters() {
        List<ActivityRegister> activitieRegisters = activityRegisterRepository.findAll();
        return mapToActivityRegisterResponseList(activitieRegisters);
    }

    @Transactional
    public void createActivityRegister(ActivityRegisterRequest request, Long activityId, Long userId) {
        // Implementation for creating activity register
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));

        ActivityRegister activityRegister = ActivityRegister.builder()
                .numberOfRegister(request.getNumberOfRegister())
                .status(ActivityRegisterStatus.PENDING)
                .build();

        activity.addActivityRegister(activityRegister);
        user.addActivityRegister(activityRegister);

        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void confirmActivityRegister(Long activityRegisterId) {
        // Implementation for confirming activity register
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        activityRegister.setStatus(ActivityRegisterStatus.CONFIRMED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void cancelActivityRegister(Long activityRegisterId) {
        // Implementation for canceling activity register
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));
    
        activityRegister.setStatus(ActivityRegisterStatus.CANCELED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void completeActivityRegister(Long activityRegisterId) {
        // Implementation for completing activity register
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        activityRegister.setStatus(ActivityRegisterStatus.COMPLETED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void deleteActivityRegister(Long activityRegisterId) {
        // Implementation for deleting activity register
        if (!activityRegisterRepository.existsById(activityRegisterId)) {
            throw new RuntimeException("Activity register not found with id: " + activityRegisterId);
        }
        activityRegisterRepository.deleteById(activityRegisterId);
    }
}
