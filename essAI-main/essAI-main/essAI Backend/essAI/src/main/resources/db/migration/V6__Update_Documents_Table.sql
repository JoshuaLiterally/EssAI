-- File: src/main/resources/db/migration/V5__Update_Documents_Table.sql

-- Remove the 'metadata' column
ALTER TABLE documents
    DROP COLUMN metadata;

-- Create a new table for document tags
CREATE TABLE document_tags (
    document_id UUID REFERENCES documents(document_id),
    tag VARCHAR(255),
    PRIMARY KEY (document_id, tag)
);