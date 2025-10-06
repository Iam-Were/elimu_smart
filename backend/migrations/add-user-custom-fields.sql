-- Add custom fields to _User table
-- Run this on staging and production databases

-- Add firstName column
ALTER TABLE "_User"
ADD COLUMN IF NOT EXISTS "firstName" text;

-- Add lastName column
ALTER TABLE "_User"
ADD COLUMN IF NOT EXISTS "lastName" text;

-- Add role column
ALTER TABLE "_User"
ADD COLUMN IF NOT EXISTS "role" text;

-- Add isActive column
ALTER TABLE "_User"
ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;

-- Add adminRoleType column (for admin users)
ALTER TABLE "_User"
ADD COLUMN IF NOT EXISTS "adminRoleType" text;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS "_User_role_idx" ON "_User" ("role");
CREATE INDEX IF NOT EXISTS "_User_isActive_idx" ON "_User" ("isActive");

-- Verify columns added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = '_User'
  AND column_name IN ('firstName', 'lastName', 'role', 'isActive', 'adminRoleType')
ORDER BY column_name;
