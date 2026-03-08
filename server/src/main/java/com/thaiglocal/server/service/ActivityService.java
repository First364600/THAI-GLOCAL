package com.thaiglocal.server.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thaiglocal.server.dto.request.ActivityRequest;
import com.thaiglocal.server.dto.response.ActivityRegisterReponse;
import com.thaiglocal.server.dto.response.ActivityResponse;
import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.Workshop;
import com.thaiglocal.server.repository.ActivityRepository;
import com.thaiglocal.server.repository.WorkshopRepository;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final WorkshopRepository workshopRepository;

    public ActivityService(
        ActivityRepository activityRepository,
        WorkshopRepository workshopRepository
    ) {
        this.activityRepository = activityRepository;
        this.workshopRepository = workshopRepository;
    }

    private ActivityResponse mapToActivityResponse(Activity activity) {
        List<ActivityRegisterReponse> registerInfo = activity.getActivityRegisters().stream()
                .map(activityRegister -> ActivityRegisterReponse.builder()
                        .activityRegisterId(activityRegister.getActivityRegisterId())
                        .username(activityRegister.getUser().getUsername())
                        .numberOfRegister(activityRegister.getNumberOfRegister())
                        .status(activityRegister.getStatus())
                        .build())
                .toList();
                
        return ActivityResponse.builder()
                .activityId(activity.getActivityId())
                .activityName(activity.getActivityName())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .description(activity.getDescription())
                .dateCanRegister(activity.getDateCanRegister())
                .price(activity.getPrice())
                .registerCapacity(activity.getRegisterCapacity())
                .registerInfo(registerInfo)
                .build();
    }

    private List<ActivityResponse> mapToActivityResponseList(List<Activity> activities) {
        return activities.stream()
                .map(this::mapToActivityResponse)
                .toList();
    }

    public List<ActivityResponse> getActivitiesByWorkshopId(Long workshopId) {
        List<Activity> activities = activityRepository.findByWorkshop_WorkshopId(workshopId);
        return mapToActivityResponseList(activities);
    }

    public ActivityResponse getActivityById(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        return mapToActivityResponse(activity);
    }

    public List<ActivityResponse> getAllActivities() {
        List<Activity> activities = activityRepository.findAll();
        return mapToActivityResponseList(activities);
    }

    @Transactional
    public void createActivity(Long workshopId, ActivityRequest request) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new RuntimeException("Workshop not found with id: " + workshopId));

        Activity activity = Activity.builder()
                .activityName(request.getActivityName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .dateCanRegister(request.getDateCanRegister())
                .price(request.getPrice())
                .registerCapacity(request.getRegisterCapacity())
                .build();

        workshop.addActivity(activity); // Set the relationship between Workshop and Activity

        activityRepository.save(activity);
    }

    @Transactional
    public void updateActivity(Long activityId, ActivityRequest request) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        if (request.getActivityName() != null) {
            activity.setActivityName(request.getActivityName());
        }
        if (request.getStartDate() != null) {
            activity.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            activity.setEndDate(request.getEndDate());
        }
        if (request.getDescription() != null) {
            activity.setDescription(request.getDescription());
        }
        if (request.getDateCanRegister() != null) {
            activity.setDateCanRegister(request.getDateCanRegister());
        }
        if (request.getPrice() != null) {
            activity.setPrice(request.getPrice());
        }
        if (request.getRegisterCapacity() != null) {
            activity.setRegisterCapacity(request.getRegisterCapacity());
        }
        activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        activityRepository.delete(activity);
    }

}
