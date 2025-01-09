package com.essAI.essAI.service;

import com.essAI.essAI.entity.Folder;
import com.essAI.essAI.repository.FolderRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FolderService {
    private final FolderRepo folderRepo;

    public List<Folder> getRootFolders() {
        return folderRepo.findByParentFolderIsNull();
    }

    public List<Folder> getSubFolders(UUID parentId) {
        return folderRepo.findByParentFolderFolderId(parentId);
    }

    public Folder createFolder(Folder folder) {
        folder.setCreatedAt(OffsetDateTime.now());
        folder.setUpdatedAt(OffsetDateTime.now());
        return folderRepo.save(folder);
    }

    public Folder updateFolder(Folder folder) {
        Folder existingFolder = folderRepo.findById(folder.getFolderId())
                .orElseThrow();
        folder.setCreatedAt(existingFolder.getCreatedAt());
        folder.setUpdatedAt(OffsetDateTime.now());
        return folderRepo.save(folder);
    }

    public void deleteFolder(UUID id) {
        Folder folder = folderRepo.findById(id).orElseThrow();
        folder.setIsDeleted(true);
        folder.setUpdatedAt(OffsetDateTime.now());
        folderRepo.save(folder);
    }
}