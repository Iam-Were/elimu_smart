// PCI-Compliant Payment Vault Database Migration
// Separate database: elimu_smart_payments
// Run this AFTER creating the payment database

const { Client } = require('pg');
require('dotenv').config();

// Payment database connection
const PAYMENT_DB_URI = process.env.PAYMENT_DATABASE_URI || 'postgres://postgres:password@localhost:5432/elimu_smart_payments';

async function createPaymentVaultSchema() {
  const client = new Client({ connectionString: PAYMENT_DB_URI });

  try {
    await client.connect();
    console.log('🔐 Connected to payment vault database');

    // Enable pgcrypto extension for encryption
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    console.log('✅ Extensions enabled');

    // 1. Subscription Table
    console.log('\n📋 Creating Subscription table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Subscription" (
        "objectId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID NOT NULL,
        "planId" VARCHAR(50) NOT NULL,
        "planName" VARCHAR(100) NOT NULL,
        "amount" DECIMAL(10,2) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
        "checkoutRequestId" VARCHAR(100),
        "startDate" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        "cancelledAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),

        CONSTRAINT chk_subscription_status CHECK (status IN ('pending', 'active', 'expired', 'cancelled'))
      );

      CREATE INDEX IF NOT EXISTS idx_subscription_user ON "Subscription"("userId");
      CREATE INDEX IF NOT EXISTS idx_subscription_status ON "Subscription"("status");
      CREATE INDEX IF NOT EXISTS idx_subscription_checkout ON "Subscription"("checkoutRequestId");
    `);
    console.log('✅ Subscription table created');

    // 2. PaymentTransaction Table (Core PCI data)
    console.log('\n📋 Creating PaymentTransaction table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
        "objectId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID NOT NULL,
        "subscriptionId" UUID REFERENCES "Subscription"("objectId") ON DELETE CASCADE,

        -- M-Pesa Transaction Details
        "checkoutRequestId" VARCHAR(100) UNIQUE NOT NULL,
        "merchantRequestId" VARCHAR(100),
        "mpesaReceiptNumber" TEXT, -- ENCRYPTED
        "transactionDate" TIMESTAMP,

        -- Payment Details
        "amount" DECIMAL(10,2) NOT NULL,
        "phoneNumber" TEXT NOT NULL, -- ENCRYPTED
        "currency" VARCHAR(3) DEFAULT 'KES',

        -- Status
        "status" VARCHAR(20) NOT NULL DEFAULT 'initiated',
        "resultCode" VARCHAR(10),
        "resultDescription" TEXT,

        -- Audit Fields
        "ipAddress" INET,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),

        CONSTRAINT chk_payment_status CHECK (status IN ('initiated', 'pending', 'completed', 'failed'))
      );

      CREATE INDEX IF NOT EXISTS idx_payment_user ON "PaymentTransaction"("userId");
      CREATE INDEX IF NOT EXISTS idx_payment_subscription ON "PaymentTransaction"("subscriptionId");
      CREATE INDEX IF NOT EXISTS idx_payment_checkout ON "PaymentTransaction"("checkoutRequestId");
      CREATE INDEX IF NOT EXISTS idx_payment_status ON "PaymentTransaction"("status");
    `);
    console.log('✅ PaymentTransaction table created');

    // 3. Invoice Table
    console.log('\n📋 Creating Invoice table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Invoice" (
        "objectId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID NOT NULL,
        "subscriptionId" UUID REFERENCES "Subscription"("objectId") ON DELETE CASCADE,
        "paymentTransactionId" UUID REFERENCES "PaymentTransaction"("objectId") ON DELETE SET NULL,

        -- Invoice Details
        "invoiceNumber" VARCHAR(50) UNIQUE NOT NULL,
        "planName" VARCHAR(100) NOT NULL,
        "subtotal" DECIMAL(10,2) NOT NULL,
        "tax" DECIMAL(10,2) DEFAULT 0.00,
        "total" DECIMAL(10,2) NOT NULL,
        "currency" VARCHAR(3) DEFAULT 'KES',

        -- Status
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending',

        -- Dates
        "issueDate" TIMESTAMP DEFAULT NOW(),
        "paidAt" TIMESTAMP,
        "billingPeriodStart" TIMESTAMP,
        "billingPeriodEnd" TIMESTAMP,

        -- User Details (for invoice PDF)
        "userName" VARCHAR(200) NOT NULL,
        "userEmail" TEXT, -- ENCRYPTED

        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),

        CONSTRAINT chk_invoice_status CHECK (status IN ('paid', 'pending', 'failed'))
      );

      CREATE INDEX IF NOT EXISTS idx_invoice_user ON "Invoice"("userId");
      CREATE INDEX IF NOT EXISTS idx_invoice_subscription ON "Invoice"("subscriptionId");
      CREATE INDEX IF NOT EXISTS idx_invoice_number ON "Invoice"("invoiceNumber");
      CREATE INDEX IF NOT EXISTS idx_invoice_status ON "Invoice"("status");
    `);
    console.log('✅ Invoice table created');

    // 4. PaymentAuditLog Table (PCI Requirement 10)
    console.log('\n📋 Creating PaymentAuditLog table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PaymentAuditLog" (
        "objectId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID,
        "action" VARCHAR(100) NOT NULL,
        "entityType" VARCHAR(50),
        "entityId" UUID,

        -- Audit Trail
        "ipAddress" INET,
        "userAgent" TEXT,
        "requestBody" JSONB,
        "responseCode" VARCHAR(10),

        "timestamp" TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_audit_user ON "PaymentAuditLog"("userId");
      CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON "PaymentAuditLog"("timestamp");
      CREATE INDEX IF NOT EXISTS idx_audit_action ON "PaymentAuditLog"("action");
    `);
    console.log('✅ PaymentAuditLog table created');

    // Create payment_admin role
    console.log('\n👤 Creating payment_admin role...');
    try {
      await client.query(`
        CREATE ROLE payment_admin WITH LOGIN PASSWORD '${process.env.PAYMENT_DB_PASSWORD || 'change_me_in_production'}';
      `);
      console.log('✅ payment_admin role created');
    } catch (error) {
      if (error.code === '42710') { // Role already exists
        console.log('ℹ️  payment_admin role already exists');
      } else {
        console.warn('⚠️  Could not create payment_admin role:', error.message);
      }
    }

    // Grant permissions
    console.log('\n🔑 Granting permissions...');
    await client.query(`
      GRANT CONNECT ON DATABASE elimu_smart_payments TO payment_admin;
      GRANT USAGE ON SCHEMA public TO payment_admin;
      GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO payment_admin;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO payment_admin;
    `);

    // NO DELETE permission for audit compliance
    await client.query(`
      REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM payment_admin;
    `);
    console.log('✅ Permissions granted (no DELETE for audit compliance)');

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Payment Vault Schema Creation Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Tables Created:');
    console.log('   1. Subscription (subscription records)');
    console.log('   2. PaymentTransaction (M-Pesa transaction data)');
    console.log('   3. Invoice (billing records)');
    console.log('   4. PaymentAuditLog (PCI compliance logs)');
    console.log('\n🔐 Security:');
    console.log('   - Separate database for PCI scope reduction');
    console.log('   - Encrypted fields: phoneNumber, mpesaReceiptNumber, userEmail');
    console.log('   - payment_admin role with NO DELETE permission');
    console.log('   - Comprehensive audit logging');
    console.log('\n📝 Next Steps:');
    console.log('   1. Add PAYMENT_DATABASE_URI to .env');
    console.log('   2. Generate encryption key: openssl rand -hex 32');
    console.log('   3. Add PAYMENT_ENCRYPTION_KEY to .env');
    console.log('   4. Create encryption service module');
    console.log('   5. Update M-Pesa service to use payment vault');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migration if executed directly
if (require.main === module) {
  createPaymentVaultSchema()
    .then(() => {
      console.log('✅ Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { createPaymentVaultSchema };
