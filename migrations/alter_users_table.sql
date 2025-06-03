-- Alter users table to allow NULL passwords
ALTER TABLE users ALTER COLUMN password DROP NOT NULL; 