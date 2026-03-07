package com.thaiglocal.server.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thaiglocal.server.dto.request.WorkshopCreateRequest;
import com.thaiglocal.server.dto.request.WorkshopUpdateRequest;
import com.thaiglocal.server.dto.response.ActivityResponse;
import com.thaiglocal.server.dto.response.WorkshopResponse;
import com.thaiglocal.server.exception.NotFoundException;
import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.Center;
import com.thaiglocal.server.model.Workshop;
import com.thaiglocal.server.model.WorkshopImage;
import com.thaiglocal.server.repository.CenterRepository;
import com.thaiglocal.server.repository.WorkshopRepository;

@Service
public class WorkshopService {
    private final WorkshopRepository workshopRepository;
    private final CenterRepository centerRepository;

    public WorkshopService(
        WorkshopRepository workshopRepository,
        CenterRepository centerRepository
        )
    {
        this.workshopRepository = workshopRepository;
        this.centerRepository = centerRepository;
    }

    private WorkshopResponse mapToWorkshopResponse(Workshop workshop) {
        List<ActivityResponse> activityResponses = workshop.getActivities().stream()
            .map(activity -> ActivityResponse.builder()
                    .activityId(activity.getActivityId())
                    .activityName(activity.getActivityName())
                    .startDate(activity.getStartDate())
                    .endDate(activity.getEndDate())
                    .description(activity.getDescription())
                    .dateCanRegister(activity.getDateCanRegister())
                    .price(activity.getPrice())
                    .registerCapacity(activity.getRegisterCapacity())
                    .build())
            .toList();

        List<String> imageUrls = workshop.getWorkshopImages().stream()
            .map(WorkshopImage::getImageUrl)
            .toList();
            
        return WorkshopResponse.builder()
                .workshopId(workshop.getWorkshopId())
                .workshopName(workshop.getWorkshopName())
                .description(workshop.getDescription())
                .price(workshop.getPrice())
                .MemberCapacity(workshop.getMemberCapacity())
                .workshopType(workshop.getWorkshopType())
                .workshopImages(imageUrls)
                .activities(activityResponses)
                .build();
    }

    private List<WorkshopResponse> mapToWorkshopResponseList(List<Workshop> workshops) {
        return workshops.stream()
                .map(this::mapToWorkshopResponse)
                .toList();
    }

    public WorkshopResponse getWorkshopById(Long workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new NotFoundException("Workshop not found with id: " + workshopId));
        return mapToWorkshopResponse(workshop);
    }

    public List<WorkshopResponse> getAllWorkshops() {
        List<Workshop> workshops = workshopRepository.findAll();
        return mapToWorkshopResponseList(workshops);
    }

    public List<WorkshopResponse> getWorkshopsByCenterId(Long centerId) {
        List<Workshop> workshops = workshopRepository.findByCenter_CenterId(centerId);
        return mapToWorkshopResponseList(workshops);
    }

    public List<WorkshopResponse> getWorkshopsByCenterIdAndType(Long centerId, String workshopType) {
        List<Workshop> workshops = workshopRepository.findByCenter_CenterId(centerId).stream()
                .filter(workshop -> workshop.getWorkshopType().equalsIgnoreCase(workshopType))
                .toList();
        return mapToWorkshopResponseList(workshops);
    }

    public List<WorkshopResponse> getWorkshopsByType(String workshopType) {
        List<Workshop> workshops = workshopRepository.findAll().stream()
                .filter(workshop -> workshop.getWorkshopType().equalsIgnoreCase(workshopType))
                .toList();
        return mapToWorkshopResponseList(workshops);
    }

    public List<WorkshopResponse> searchWorkshopsByName(String name) {
        List<Workshop> workshops = workshopRepository.findByWorkshopNameContainingIgnoreCase(name);
        return mapToWorkshopResponseList(workshops);
    }

    @Transactional
    public void createWorkshop(WorkshopCreateRequest request) {
        Center center = centerRepository.findById(request.getCenterId())
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + request.getCenterId()));
                
        Workshop workshop = Workshop.builder()
                .workshopName(request.getWorkshopName())
                .description(request.getDescription())
                .price(request.getPrice())
                .memberCapacity(request.getMemberCapacity())
                .workshopType(request.getWorkshopType())
                .build();

        center.addWorkshop(workshop); // Set the relationship between Center and Workshop

        // Handle workshop images
        if (request.getWorkshopImages() != null && !request.getWorkshopImages().isEmpty()) {
            for (String imageUrl : request.getWorkshopImages()) {
                WorkshopImage workshopImage = new WorkshopImage();
                workshopImage.setImageUrl(imageUrl);
                workshop.addWorkshopImage(workshopImage);
            }
        }

        // Handle activities
        if (request.getActivities() != null && !request.getActivities().isEmpty()) {
            for (var activityRequest : request.getActivities()) {
                Activity activities = Activity.builder()
                        .activityName(activityRequest.getActivityName())
                        .startDate(activityRequest.getStartDate())
                        .endDate(activityRequest.getEndDate())
                        .description(activityRequest.getDescription())
                        .dateCanRegister(activityRequest.getDateCanRegister())
                        .price(activityRequest.getPrice())
                        .registerCapacity(activityRequest.getRegisterCapacity())
                        .build();
                
                workshop.addActivity(activities);
            }
        }

        
        workshopRepository.save(workshop);
    }

    @Transactional
    public void updateWorkshop(Long workshopId, WorkshopUpdateRequest request) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new NotFoundException("Workshop not found with id: " + workshopId));
        if (request.getWorkshopName() != null) {
            workshop.setWorkshopName(request.getWorkshopName());
        }
        if (request.getDescription() != null) {
            workshop.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            workshop.setPrice(request.getPrice());
        }
        if (request.getMemberCapacity() != null) {
            workshop.setMemberCapacity(request.getMemberCapacity());
        }
        if (request.getWorkshopType() != null) {
            workshop.setWorkshopType(request.getWorkshopType());
        }


        // Update images
        if (request.getWorkshopImages() != null) {
            // Clear existing images
            workshop.getWorkshopImages().clear();
            // Add new images
            for (String imageUrl : request.getWorkshopImages()) {
                WorkshopImage workshopImage = new WorkshopImage();
                workshopImage.setImageUrl(imageUrl);
                workshop.addWorkshopImage(workshopImage);
            }
        }

        workshopRepository.save(workshop);
    }

    @Transactional
    public void deleteWorkshop(Long workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new NotFoundException("Workshop not found with id: " + workshopId));
        workshopRepository.delete(workshop);
    }



}
