-- Initialize the database with proper settings
-- This file will be executed when the PostgreSQL container starts for the first time

-- Set timezone
SET timezone = 'UTC';

-- Enable UUID extension (in case it's needed in the future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes that might be useful
-- These will be created after Prisma migrations are run