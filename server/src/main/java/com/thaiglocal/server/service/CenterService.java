package com.thaiglocal.server.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.thaiglocal.server.dto.request.CenterRequest;
import com.thaiglocal.server.dto.response.CenterResponse;
import com.thaiglocal.server.dto.response.StaffResponse;
import com.thaiglocal.server.exception.InvalidRoleException;
import com.thaiglocal.server.exception.NotFoundException;
import com.thaiglocal.server.model.Center;
import com.thaiglocal.server.model.CenterBelongUser;
import com.thaiglocal.server.model.CenterImage;
import com.thaiglocal.server.model.Telephone;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.PositionName;
import com.thaiglocal.server.model.enums.RoleName;
import com.thaiglocal.server.repository.CenterBelongUserRepository;
import com.thaiglocal.server.repository.CenterRepository;
import com.thaiglocal.server.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CenterService {
    private final CenterRepository centerRepository;
    private final UserRepository userRepository;
    private final CenterBelongUserRepository centerBelongUserRepository;

    public CenterService(
        CenterRepository centerRepository,
        UserRepository userRepository,
        CenterBelongUserRepository centerBelongUserRepository
    )
    {
        this.centerRepository = centerRepository;
        this.userRepository = userRepository;
        this.centerBelongUserRepository = centerBelongUserRepository;
    }

    private CenterResponse mapToCenterResponse(Center center) {
        List<String> imageUrls = center.getCenterImages().stream()
            .map(CenterImage::getImageUrl)
            .toList();
        List<String> telephoneNumbers = center.getTelephones().stream()
            .map(Telephone::getTelephoneNumber)
            .toList();

        List<StaffResponse> staffResponses = center.getCenterBelongUsers().stream()
            .map(cbu -> {
                User user = cbu.getUser();
                return StaffResponse.builder()
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phoneNumber(user.getTelephone())
                    .position(cbu.getPosition())
                    .build();
            })
            .toList();

        return CenterResponse.builder()
                .centerId(center.getCenterId())
                .centerName(center.getCenterName())
                .description(center.getDescription())
                .address(center.getAddress())
                .subDistrict(center.getSubDistrict())
                .district(center.getDistrict())
                .province(center.getProvince())
                .googleMapLink(center.getGoogleMapLink())
                .email(center.getEmail())
                .line(center.getLine())
                .facebook(center.getFacebook())
                .webSite(center.getWebSite())
                .createdAt(center.getCreatedAt())
                .leaderFirstName(center.getLeaderFirstName())
                .leaderLastName(center.getLeaderLastName())
                .leaderTelephone(center.getLeaderTelephone())
                .centerImages(imageUrls)
                .telephones(telephoneNumbers)
                .staffResponses(staffResponses)
                .build();
    }

    private List<CenterResponse> mapToCenterResponseList(List<Center> centers) {
        return centers.stream()
                .map(this::mapToCenterResponse)
                .toList();
    }

    public List<CenterResponse> getAllCenters() {
        List<Center> centers = centerRepository.findAll();
        return mapToCenterResponseList(centers);
    }

    public CenterResponse getCenterById(Long centerId) {
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + centerId));
        return mapToCenterResponse(center);
    }

    public List<CenterResponse> searchCentersByName(String centerName) {
        List<Center> centers = centerRepository.findByCenterNameContainingIgnoreCase(centerName);
        return mapToCenterResponseList(centers);
    }

    @Transactional
    public List<CenterResponse> getCenterByCenterAdminId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!user.getRole().equals(RoleName.CENTER_ADMIN)) {
            throw new InvalidRoleException("Role must be "+ RoleName.CENTER_ADMIN + " to access this resource");
        }

        List<Center> centers = user.getCenterBelongUsers().stream()
                .map(centerBelongUser -> centerBelongUser.getCenter())
                .toList();

        return mapToCenterResponseList(centers);
    }

    @Transactional
    public void createCenter(CenterRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setRole(RoleName.CENTER_ADMIN);
        userRepository.save(user);

        Center center = Center.builder()
                .centerName(request.getCenterName())
                .description(request.getDescription())
                .address(request.getAddress())
                .subDistrict(request.getSubDistrict())
                .district(request.getDistrict())
                .province(request.getProvince())
                .googleMapLink(request.getGoogleMapLink())
                .email(request.getEmail())
                .line(request.getLine())
                .facebook(request.getFacebook())
                .webSite(request.getWebSite())
                .createdAt(request.getCreatedAt() != null ? request.getCreatedAt() : LocalDateTime.now())
                .leaderFirstName(request.getLeaderFirstName())
                .leaderLastName(request.getLeaderLastName())
                .leaderTelephone(request.getLeaderTelephone())
                .build();

        if (request.getCenterImages() != null && !request.getCenterImages().isEmpty()) {
            for (String imageUrl : request.getCenterImages()) {
                CenterImage image = new CenterImage();
                image.setImageUrl(imageUrl);
                
                center.addCenterImage(image);
            }
        }

        if (request.getTelephones() != null && !request.getTelephones().isEmpty()) {
            for (String telephoneNumber : request.getTelephones()) {
                Telephone telephone = new Telephone();
                telephone.setTelephoneNumber(telephoneNumber);
                
                center.addTelephone(telephone);
            }
        }

        centerRepository.save(center);

        CenterBelongUser centerBelongUser = CenterBelongUser.builder()
                .position(PositionName.CENTER_ADMIN)
                .build();

        center.addCenterBelongUser(centerBelongUser);
        user.addCenterBelongUser(centerBelongUser);
        
        centerBelongUserRepository.save(centerBelongUser);
    }

    public void addCenterAdmin(Long centerId, Long userId) {
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + centerId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean alreadyExists = center.getCenterBelongUsers().stream()
                .anyMatch(cbu -> cbu.getUser().getUserId().equals(userId));

        if (alreadyExists) {
            throw new RuntimeException("User with id: " + userId + " is already associated with center id: " + centerId);
        }

        user.setRole(RoleName.CENTER_ADMIN);
        userRepository.save(user);

        CenterBelongUser centerBelongUser = CenterBelongUser.builder()
                .position(PositionName.CENTER_ADMIN)
                .build();

        center.addCenterBelongUser(centerBelongUser);
        user.addCenterBelongUser(centerBelongUser);

        centerBelongUserRepository.save(centerBelongUser);
    }

    public void addCenterStaff(Long centerId, Long userId) {
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + centerId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean alreadyExists = center.getCenterBelongUsers().stream()
            .anyMatch(cbu -> cbu.getUser().getUserId().equals(userId));

        if (alreadyExists) {
            throw new RuntimeException("User with id: " + userId + " is already associated with center id: " + centerId);
        }

        user.setRole(RoleName.CENTER_ADMIN);
        userRepository.save(user);

        CenterBelongUser centerBelongUser = CenterBelongUser.builder()
                .position(PositionName.CENTER_STAFF)
                .build();

        center.addCenterBelongUser(centerBelongUser);
        user.addCenterBelongUser(centerBelongUser);

        centerBelongUserRepository.save(centerBelongUser);
    }

    @Transactional
    public void updateCenter(Long centerId, CenterRequest request) {
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + centerId));
        if (request.getCenterName() != null) {
            center.setCenterName(request.getCenterName());
        }
        if (request.getDescription() != null) {
            center.setDescription(request.getDescription());
        }
        if (request.getAddress() != null) {
            center.setAddress(request.getAddress());
        }
        if (request.getSubDistrict() != null) {
            center.setSubDistrict(request.getSubDistrict());
        }
        if (request.getDistrict() != null) {
            center.setDistrict(request.getDistrict());
        }
        if (request.getProvince() != null) {
            center.setProvince(request.getProvince());
        }
        if (request.getGoogleMapLink() != null) {
            center.setGoogleMapLink(request.getGoogleMapLink());
        }
        if (request.getEmail() != null) {
            center.setEmail(request.getEmail());
        }
        if (request.getLine() != null) {
            center.setLine(request.getLine());
        }
        if (request.getFacebook() != null) {
            center.setFacebook(request.getFacebook());
        }
        if (request.getWebSite() != null) {
            center.setWebSite(request.getWebSite());
        }
        if (request.getCreatedAt() != null) {
            center.setCreatedAt(request.getCreatedAt());
        }
        if (request.getLeaderFirstName() != null) {
            center.setLeaderFirstName(request.getLeaderFirstName());
        }
        if (request.getLeaderLastName() != null) {
            center.setLeaderLastName(request.getLeaderLastName());
        }
        if (request.getLeaderTelephone() != null) {
            center.setLeaderTelephone(request.getLeaderTelephone());
        }

        if (request.getCenterImages() != null) {
            // remove existing images
            center.getCenterImages().clear();

            // add new images
            for (String imageUrl : request.getCenterImages()) {
                CenterImage image = new CenterImage();
                image.setImageUrl(imageUrl);
                
                center.addCenterImage(image);
            }
        }

        if (request.getTelephones() != null) {
            // remove existing telephones
            center.getTelephones().clear();

            // add new telephones
            for (String telephoneNumber : request.getTelephones()) {
                Telephone telephone = new Telephone();
                telephone.setTelephoneNumber(telephoneNumber);
                center.addTelephone(telephone);
            }
        }

        centerRepository.save(center);
    }

    public void deleteCenter(Long centerId) {
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new NotFoundException("Center not found with id: " + centerId));
        centerRepository.delete(center);
    }
}
