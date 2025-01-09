package com.essAI.essAI.service;

import com.essAI.essAI.entity.User;
import com.essAI.essAI.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepo userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User getUserById(UUID id) {
        return userRepo.findById(id).orElse(null);
    }

    public User getUserByFirebaseUid(String firebaseUid) {
        log.info("Fetching user with Firebase UID: {}", firebaseUid);
        return userRepo.findByFirebaseUid(firebaseUid).orElse(null);
    }

    public User saveUser(User user) {
        if (user.getFirebaseUid() == null || user.getFirebaseUid().isEmpty()) {
            throw new IllegalArgumentException("Firebase UID must not be null or empty");
        }
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepo.findByFirebaseUid(user.getFirebaseUid()).isPresent()) {
            throw new IllegalArgumentException("Firebase UID already exists");
        }
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        return userRepo.save(user);
    }

    public User updateUser(User user) {
        Optional<User> existingUser = userRepo.findById(user.getUserId());
        if (existingUser.isPresent()) {
            user.setCreatedAt(existingUser.get().getCreatedAt());
            user.setUpdatedAt(OffsetDateTime.now());
            return userRepo.save(user);
        } else {
            return null;
        }
    }

    public void deleteUserById(UUID id) {
        userRepo.deleteById(id);
    }
}