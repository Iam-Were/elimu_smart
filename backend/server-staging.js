// Staging environment loader - loads .env.staging explicitly
require('dotenv').config({ path: '.env.staging' });

// Then start the regular server
require('./server-working.js');
