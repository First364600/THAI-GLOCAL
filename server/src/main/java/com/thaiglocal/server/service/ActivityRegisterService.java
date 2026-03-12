package com.thaiglocal.server.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thaiglocal.server.dto.request.ActivityRegisterRequest;
import com.thaiglocal.server.dto.response.ActivityRegisterReponse;
import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.ActivityRegister;
import com.thaiglocal.server.model.Center;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.Workshop;
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
        Activity activity = activityRegister.getActivity();
        int count = activityRegister.getNumberOfRegister() != null ? activityRegister.getNumberOfRegister() : 0;
        double price = activity != null && activity.getPrice() != null ? activity.getPrice() : 0.0;
        return ActivityRegisterReponse.builder()
                .activityRegisterId(activityRegister.getActivityRegisterId())
                .activityId(activity != null ? activity.getActivityId() : null)
                .activityName(activity != null ? activity.getActivityName() : null)
                .startDate(activity != null && activity.getStartDate() != null
                        ? activity.getStartDate().toString() : null)
                // .user(activityRegister.getUser())
                .username(activityRegister.getUser().getUsername())
                .numberOfRegister(count)
                .status(activityRegister.getStatus())
                .totalPrice(count * price)
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

    public List<ActivityRegisterReponse> getActivityRegistersByUserId(Long userId) {
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));

        //ตรวจสอบว่า user ไม่ใช่เจ้าของศูนย์
        Workshop workshop = activity.getWorkshop();
        if (workshop == null) {
            throw new RuntimeException("Activity must belong to a workshop");
        }

        Center center = workshop.getCenter();
        if (center == null) {
            throw new RuntimeException("Workshop must belong to a center");
        }

        // ตรวจสอบผ่าน CenterBelongUser ว่า user เป็นเจ้าของศูนย์หรือไม่
        boolean isCenterOwner = center.getCenterBelongUsers().stream()
                .anyMatch(cbu -> cbu.getUser().getUserId().equals(userId));

        if (isCenterOwner) {
            throw new RuntimeException("Center owner cannot register for activities");
        }

        int requestCount = request.getNumberOfRegister() != null ? request.getNumberOfRegister() : 0;
        int maxCapacity = activity.getRegisterCapacity() != null ? activity.getRegisterCapacity() : 0;

        int currentRegisteredCount = activity.getActivityRegisters().stream()
                .filter(reg -> reg.getStatus() != ActivityRegisterStatus.CANCELLED)
                .mapToInt(reg -> reg.getNumberOfRegister() != null ? reg.getNumberOfRegister() : 0)
                .sum();

        int availableCapacity = maxCapacity - currentRegisteredCount;

        if (requestCount > availableCapacity) {
            throw new RuntimeException("Number of register exceeds available capacity");
        }

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
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        activityRegister.setStatus(ActivityRegisterStatus.CONFIRMED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void cancelActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));
    
        activityRegister.setStatus(ActivityRegisterStatus.CANCELLATION_REQUESTED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void completeActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        activityRegister.setStatus(ActivityRegisterStatus.COMPLETED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void deleteActivityRegister(Long activityRegisterId) {
        if (!activityRegisterRepository.existsById(activityRegisterId)) {
            throw new RuntimeException("Activity register not found with id: " + activityRegisterId);
        }
        activityRegisterRepository.deleteById(activityRegisterId);
    }

    @Transactional
    public void rejectActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        activityRegister.setStatus(ActivityRegisterStatus.REJECTED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void requestCancelActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        if (activityRegister.getStatus() != ActivityRegisterStatus.CONFIRMED) {
            throw new RuntimeException("Can only request cancellation for confirmed bookings");
        }

        activityRegister.setStatus(ActivityRegisterStatus.CANCELLATION_REQUESTED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void approveCancelActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        if (activityRegister.getStatus() != ActivityRegisterStatus.CANCELLATION_REQUESTED) {
            throw new RuntimeException("Can only approve cancellation for cancellation_requested bookings");
        }

        activityRegister.setStatus(ActivityRegisterStatus.CANCELLED);
        activityRegisterRepository.save(activityRegister);
    }

    @Transactional
    public void rejectCancelActivityRegister(Long activityRegisterId) {
        ActivityRegister activityRegister = activityRegisterRepository.findById(activityRegisterId)
                .orElseThrow(() -> new RuntimeException("Activity register not found with id: " + activityRegisterId));

        if (activityRegister.getStatus() != ActivityRegisterStatus.CANCELLATION_REQUESTED) {
            throw new RuntimeException("Can only reject cancellation for cancellation_requested bookings");
        }

        activityRegister.setStatus(ActivityRegisterStatus.CANCELLATION_REJECTED);
        activityRegisterRepository.save(activityRegister);
    }
}
