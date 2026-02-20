// Migration: Create School table + add school fields to _User
// Run: node -e "require('dotenv').config(); require('child_process').execSync('node migrations/create-school-schema.js', {env: process.env, stdio: 'inherit'});"

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgres://postgres:password@localhost:5432/elimu_smart_dev'
});

async function migrate() {
  await client.connect();
  console.log('Connected to database');

  // Add school fields to _User
  await client.query(`
    ALTER TABLE "_User"
      ADD COLUMN IF NOT EXISTS "schoolId"   text,
      ADD COLUMN IF NOT EXISTS "schoolCode" text,
      ADD COLUMN IF NOT EXISTS "schoolName" text;
    CREATE INDEX IF NOT EXISTS "idx_user_school" ON "_User" ("schoolId");
    CREATE INDEX IF NOT EXISTS "idx_user_school_code" ON "_User" ("schoolCode");
  `);
  console.log('Added school fields to _User');

  // Create School class table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "School" (
      "objectId"     text PRIMARY KEY,
      "createdAt"    timestamp with time zone DEFAULT now(),
      "updatedAt"    timestamp with time zone DEFAULT now(),
      "_rperm"       text[],
      "_wperm"       text[],
      "name"         text NOT NULL,
      "code"         text NOT NULL UNIQUE,
      "county"       text NOT NULL,
      "type"         text DEFAULT 'public',
      "contactName"  text,
      "contactEmail" text,
      "contactPhone" text,
      "seatLimit"    integer DEFAULT 0,
      "isActive"     boolean DEFAULT true
    );
    CREATE INDEX IF NOT EXISTS "idx_school_code"   ON "School" ("code");
    CREATE INDEX IF NOT EXISTS "idx_school_county" ON "School" ("county");
  `);
  console.log('Created School table');

  await client.end();
  console.log('Migration complete');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
