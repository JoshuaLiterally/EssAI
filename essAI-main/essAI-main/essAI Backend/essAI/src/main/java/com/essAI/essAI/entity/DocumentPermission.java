package com.essAI.essAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "document_permissions")
public class DocumentPermission {
    @Id
    @GeneratedValue
    private UUID permissionId;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PermissionLevel permissionLevel;

    @ManyToOne
    @JoinColumn(name = "granted_by")
    private User grantedBy;

    private OffsetDateTime createdAt;

    public enum PermissionLevel {
        VIEWER, COMMENTER, EDITOR, OWNER
    }
}