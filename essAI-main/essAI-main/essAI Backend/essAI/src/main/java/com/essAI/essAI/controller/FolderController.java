package com.essAI.essAI.controller;

import com.essAI.essAI.entity.Folder;
import com.essAI.essAI.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/folder/v1")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @GetMapping("/root")
    public ResponseEntity<List<Folder>> getRootFolders() {
        return ResponseEntity.ok(folderService.getRootFolders());
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<Folder>> getSubFolders(@PathVariable UUID parentId) {
        return ResponseEntity.ok(folderService.getSubFolders(parentId));
    }

    @PostMapping("/")
    public ResponseEntity<Folder> createFolder(@RequestBody Folder folder) {
        return ResponseEntity.ok(folderService.createFolder(folder));
    }

    @PutMapping("/")
    public ResponseEntity<Folder> updateFolder(@RequestBody Folder folder) {
        return ResponseEntity.ok(folderService.updateFolder(folder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable UUID id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }
}