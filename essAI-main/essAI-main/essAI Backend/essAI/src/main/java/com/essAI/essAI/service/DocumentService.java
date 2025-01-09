package com.essAI.essAI.service;

import com.essAI.essAI.entity.Document;
import com.essAI.essAI.entity.User;
import com.essAI.essAI.repository.DocumentRepo;
import com.essAI.essAI.repository.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepo documentRepo;
    private final UserRepo userRepo;

    public List<Document> getAllDocuments() {
        return documentRepo.findAll();
    }

    public Document getDocumentById(UUID id) {
        return documentRepo.findById(id).orElse(null);
    }

    public List<Document> getDocumentsByFolder(UUID folderId) {
        return documentRepo.findByFolderFolderId(folderId);
    }

    public List<Document> getDocumentsByFirebaseUid(String firebaseUid) {
        return documentRepo.findByCreatedByFirebaseUid(firebaseUid);
    }

    public Document createDocument(Document document) {
        // Ensure 'created_by' user exists
        UUID createdById = document.getCreatedBy().getUserId();
        User createdBy = userRepo.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User with ID " + createdById + " not found"));

        // Ensure 'last_modified_by' user exists
        UUID lastModifiedById = document.getLastModifiedBy().getUserId();
        User lastModifiedBy = userRepo.findById(lastModifiedById)
                .orElseThrow(() -> new RuntimeException("User with ID " + lastModifiedById + " not found"));

        // Set the full User entities in the Document
        document.setCreatedBy(createdBy);
        document.setLastModifiedBy(lastModifiedBy);

        // Set timestamps
        document.setCreatedAt(OffsetDateTime.now());
        document.setUpdatedAt(OffsetDateTime.now());

        // Save the Document
        return documentRepo.save(document);
    }

    public Document updateDocument(Document document) {
        Document existingDocument = documentRepo.findById(document.getDocumentId())
                .orElseThrow();
        document.setCreatedAt(existingDocument.getCreatedAt());
        document.setUpdatedAt(OffsetDateTime.now());
        return documentRepo.save(document);
    }

    public Document updateDocumentContent(UUID id, String content) {
        Document document = documentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setContent(content);
        document.setUpdatedAt(OffsetDateTime.now());

        return documentRepo.save(document);
    }

    public Document updateDocumentTitle(UUID id, String title) {
        Document document = documentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setTitle(title);
        document.setUpdatedAt(OffsetDateTime.now());

        return documentRepo.save(document);
    }

    public void deleteDocument(UUID id) {
        Document document = documentRepo.findById(id).orElseThrow();
        document.setIsDeleted(true);
        document.setUpdatedAt(OffsetDateTime.now());
        documentRepo.save(document);
    }
}