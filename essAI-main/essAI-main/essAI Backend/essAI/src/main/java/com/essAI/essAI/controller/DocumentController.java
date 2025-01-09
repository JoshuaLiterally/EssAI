package com.essAI.essAI.controller;

import com.essAI.essAI.entity.Document;
import com.essAI.essAI.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/document/v1")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping("/")
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable UUID id) {
        Document document = documentService.getDocumentById(id);
        return document != null ? ResponseEntity.ok(document) : ResponseEntity.notFound().build();
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<Document>> getDocumentsByFolder(@PathVariable UUID folderId) {
        return ResponseEntity.ok(documentService.getDocumentsByFolder(folderId));
    }

    @GetMapping("/firebase/{firebaseUid}")
    public ResponseEntity<List<Document>> getDocumentsByFirebaseUid(@PathVariable String firebaseUid) {
        return ResponseEntity.ok(documentService.getDocumentsByFirebaseUid(firebaseUid));
    }

    @PostMapping("/")
    public ResponseEntity<Document> createDocument(@RequestBody Document document) {
        return ResponseEntity.ok(documentService.createDocument(document));
    }

    @PutMapping("/")
    public ResponseEntity<Document> updateDocument(@RequestBody Document document) {
        return ResponseEntity.ok(documentService.updateDocument(document));
    }

    @PutMapping("/{id}/content")
    public ResponseEntity<Document> updateDocumentContent(
            @PathVariable UUID id,
            @RequestBody String content) {
        return ResponseEntity.ok(documentService.updateDocumentContent(id, content));
    }

    @PutMapping("/{id}/title")
    public ResponseEntity<Document> updateDocumentTitle(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        String title = request.get("title");
        return ResponseEntity.ok(documentService.updateDocumentTitle(id, title));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }
}