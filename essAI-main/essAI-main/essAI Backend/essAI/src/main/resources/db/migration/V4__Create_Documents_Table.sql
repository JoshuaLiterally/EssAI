-- File: src/main/resources/db/migration/V4__Create_Documents_Table.sql
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID REFERENCES users(user_id),
    is_deleted BOOLEAN DEFAULT false,
    folder_id UUID REFERENCES folders(folder_id),
    document_type VARCHAR(50) NOT NULL,
    is_template BOOLEAN DEFAULT false,
    metadata JSONB
);

CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_documents_folder_id ON documents(folder_id);