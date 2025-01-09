package com.essAI.essAI.controller;

import com.essAI.essAI.entity.DocumentPermission;
import com.essAI.essAI.service.DocumentPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/document-permission/v1")
@RequiredArgsConstructor
public class DocumentPermissionController {
    private final DocumentPermissionService permissionService;

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<DocumentPermission>> getDocumentPermissions(@PathVariable UUID documentId) {
        return ResponseEntity.ok(permissionService.getDocumentPermissions(documentId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentPermission>> getUserPermissions(@PathVariable UUID userId) {
        return ResponseEntity.ok(permissionService.getUserPermissions(userId));
    }

    @PostMapping("/")
    public ResponseEntity<DocumentPermission> grantPermission(@RequestBody DocumentPermission permission) {
        return ResponseEntity.ok(permissionService.grantPermission(permission));
    }

    @DeleteMapping("/{permissionId}")
    public ResponseEntity<Void> revokePermission(@PathVariable UUID permissionId) {
        permissionService.revokePermission(permissionId);
        return ResponseEntity.ok().build();
    }
}