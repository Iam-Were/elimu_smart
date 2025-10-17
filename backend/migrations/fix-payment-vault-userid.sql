-- Fix userId column type in payment vault database
-- Parse objectIds are strings (e.g., '5jdvira1z0'), not UUIDs

-- 1. Alter Subscription table
ALTER TABLE "Subscription" ALTER COLUMN "userId" TYPE VARCHAR(50);

-- 2. Alter PaymentTransaction table
ALTER TABLE "PaymentTransaction" ALTER COLUMN "userId" TYPE VARCHAR(50);

-- 3. Alter Invoice table
ALTER TABLE "Invoice" ALTER COLUMN "userId" TYPE VARCHAR(50);

-- 4. Alter PaymentAuditLog table
ALTER TABLE "PaymentAuditLog" ALTER COLUMN "userId" TYPE VARCHAR(50);

-- Indexes are preserved automatically
