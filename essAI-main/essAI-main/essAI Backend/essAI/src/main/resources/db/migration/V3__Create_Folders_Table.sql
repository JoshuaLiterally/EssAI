CREATE TABLE folders (
    folder_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_folder_id UUID REFERENCES folders(folder_id),
    name VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_folders_parent_folder_id ON folders(parent_folder_id);