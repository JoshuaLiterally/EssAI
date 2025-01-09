-- New migration file V7__Make_FolderId_Nullable.sql
ALTER TABLE documents
    ALTER COLUMN folder_id DROP NOT NULL;