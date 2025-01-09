package com.essAI.essAI.repository;

import com.essAI.essAI.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FolderRepo extends JpaRepository<Folder, UUID> {
    List<Folder> findByParentFolderIsNull();

    List<Folder> findByParentFolderFolderId(UUID parentId);

    List<Folder> findByCreatedByUserId(UUID userId);
}