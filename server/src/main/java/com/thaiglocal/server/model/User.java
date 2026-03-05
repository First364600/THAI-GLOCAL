package com.thaiglocal.server.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String username;
    private String password;

    // Relationship with UserProfile
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile userProfile;

    // Relationship with Notification
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    // Relationship with Role
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Role> roles = new ArrayList<>();

    // Relationship with Booking
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    // Helper method
    // add notification to user and set the user reference in notification
    public void addNotification(Notification notification) {
        notifications.add(notification);
        notification.setUser(this);
    }

    // remove notification from user and set the user reference in notification to null
    public void removeNotification(Notification notification) {
        notifications.remove(notification);
        notification.setUser(null);
    }

    // add user profile to user and set the user reference in user profile
    public void setUserProfile(UserProfile profile) {
        this.userProfile = profile;
        if (profile != null) {
            profile.setUser(this);
        }
    }

    // add role to user and set the user reference in role
    public void addRole(Role role) {
        roles.add(role);
        role.setUser(this);
    }

    // remove role from user and set the user reference in role to null
    public void removeRole(Role role) {
        roles.remove(role);
        role.setUser(null);
    }

    // add booking to user and set the user reference in booking
    public void addBooking(Booking booking) {
        bookings.add(booking);
        booking.setUser(this);
    }

    // remove booking from user and set the user reference in booking to null
    public void removeBooking(Booking booking) {
        bookings.remove(booking);
        booking.setUser(null);
    }

}
