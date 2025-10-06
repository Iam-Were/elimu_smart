// Staging environment loader - loads .env.staging explicitly
// Set flag to prevent server-working.js from loading .env
process.env.DOTENV_LOADED = 'true';

// Load staging environment
require('dotenv').config({ path: '.env.staging' });

// Then start the regular server
require('./server-working.js');
