package com.essAI.essAI.service;

import com.essAI.essAI.entity.DocumentPermission;
import com.essAI.essAI.repository.DocumentPermissionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentPermissionService {
    private final DocumentPermissionRepo permissionRepo;

    public List<DocumentPermission> getDocumentPermissions(UUID documentId) {
        return permissionRepo.findByDocumentDocumentId(documentId);
    }

    public List<DocumentPermission> getUserPermissions(UUID userId) {
        return permissionRepo.findByUserUserId(userId);
    }

    public DocumentPermission grantPermission(DocumentPermission permission) {
        permission.setCreatedAt(OffsetDateTime.now());
        return permissionRepo.save(permission);
    }

    public void revokePermission(UUID permissionId) {
        permissionRepo.deleteById(permissionId);
    }

    public boolean hasPermission(UUID documentId, UUID userId, DocumentPermission.PermissionLevel minimumLevel) {
        return permissionRepo.findByDocumentDocumentIdAndUserUserId(documentId, userId)
                .map(permission -> permission.getPermissionLevel().ordinal() >= minimumLevel.ordinal())
                .orElse(false);
    }
}