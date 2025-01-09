-- File: src/main/resources/db/migration/V1__Create_Employee_Table.sql
CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(250),
    last_name VARCHAR(250),
    age INTEGER,
    designation VARCHAR(250),
    phone_number VARCHAR(250),
    joined_on DATE,
    address VARCHAR(250),
    date_of_birth DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);