package com.essAI.essAI.repository;

import com.essAI.essAI.entity.DocumentPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentPermissionRepo extends JpaRepository<DocumentPermission, UUID> {
    List<DocumentPermission> findByDocumentDocumentId(UUID documentId);

    List<DocumentPermission> findByUserUserId(UUID userId);

    Optional<DocumentPermission> findByDocumentDocumentIdAndUserUserId(UUID documentId, UUID userId);
}