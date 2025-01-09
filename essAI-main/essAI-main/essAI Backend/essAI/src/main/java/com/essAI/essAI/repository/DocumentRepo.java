package com.essAI.essAI.repository;

import com.essAI.essAI.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DocumentRepo extends JpaRepository<Document, UUID> {
    List<Document> findByFolderFolderId(UUID folderId);

    List<Document> findByCreatedBy_UserId(UUID userId);

    List<Document> findByCreatedByFirebaseUid(String firebaseUid);

    List<Document> findByIsDeletedFalse();
}