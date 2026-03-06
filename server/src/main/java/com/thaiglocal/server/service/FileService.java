package com.thaiglocal.server.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.thaiglocal.server.dto.response.FileResponse;

@Service
public class FileService {
    private final Cloudinary cloudinary;

    public FileService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public FileResponse mapTFileResponse(String imageUrl) {
        return FileResponse.builder()
                .imageUrl(imageUrl)
                .build();
    }

    @SuppressWarnings("unchecked")
    public FileResponse uploadCenterImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        // upload file to Cloudinary
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "thaiglocal_centers"));

        // get URL
        String imageUrl = uploadResult.get("secure_url").toString();
        
        return mapTFileResponse(imageUrl);
    }

    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) return;

            String publicId = imageUrl.substring(
                    imageUrl.indexOf("thaiglocal_centers/"),
                    imageUrl.lastIndexOf(".")
            );

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("Deleted " + publicId);

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
}
