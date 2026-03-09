package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.PasswordResetCode;

import java.util.Optional;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {
    Optional<PasswordResetCode> findByUserEmailAndCodeAndIsUsedFalse(String email, String code);
    
    void deleteByUserEmail(String email); // ลบรหัสเก่า
}