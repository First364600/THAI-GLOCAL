package com.thaiglocal.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String code; // รหัส 6 หลัก
    
    @Column(nullable = false)
    private LocalDateTime expiryDate; // หมดอายุใน 10 นาที
    
    @Column(nullable = false)
    private Boolean isUsed = false; // ป้องกันใช้ซ้ำ
}