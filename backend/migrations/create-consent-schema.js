// Migration: Create ParentConsent table + add parent fields to _User
// Run: node migrations/create-consent-schema.js

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgres://postgres:password@localhost:5432/elimu_smart_dev'
});

async function migrate() {
  await client.connect();
  console.log('Connected to database');

  // Add parent fields to _User (Parse stores as custom columns)
  await client.query(`
    ALTER TABLE "_User"
      ADD COLUMN IF NOT EXISTS "parentName"         text,
      ADD COLUMN IF NOT EXISTS "parentEmail"        text,
      ADD COLUMN IF NOT EXISTS "parentPhone"        text,
      ADD COLUMN IF NOT EXISTS "parentRelationship" text,
      ADD COLUMN IF NOT EXISTS "parentConsentGiven" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "parentConsentDate"  timestamp with time zone;
  `);
  console.log('Added parent fields to _User');

  // Create ParentConsent class table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "ParentConsent" (
      "objectId"       text PRIMARY KEY,
      "createdAt"      timestamp with time zone DEFAULT now(),
      "updatedAt"      timestamp with time zone DEFAULT now(),
      "_rperm"         text[],
      "_wperm"         text[],
      "student"        text NOT NULL REFERENCES "_User"("objectId") ON DELETE CASCADE,
      "parentEmail"    text NOT NULL,
      "parentName"     text,
      "parentPhone"    text,
      "consentGiven"   boolean DEFAULT false,
      "consentDate"    timestamp with time zone,
      "consentMethod"  text DEFAULT 'email',
      "consentToken"   text UNIQUE,
      "tokenExpiresAt" timestamp with time zone,
      "requestedAt"    timestamp with time zone
    );
    CREATE INDEX IF NOT EXISTS "idx_consent_student"    ON "ParentConsent" ("student");
    CREATE INDEX IF NOT EXISTS "idx_consent_token"      ON "ParentConsent" ("consentToken");
    CREATE INDEX IF NOT EXISTS "idx_consent_email"      ON "ParentConsent" ("parentEmail");
  `);
  console.log('Created ParentConsent table');

  await client.end();
  console.log('Migration complete');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
