// Direct PostgreSQL backend server for elimu_smart
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'elimu_smart_dev',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        admin_role_type VARCHAR(50),
        profile_image TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create student progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        career_readiness_score INTEGER DEFAULT 0,
        assessments_completed INTEGER DEFAULT 0,
        streak_count INTEGER DEFAULT 0,
        last_activity TIMESTAMP,
        last_checkin TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        assessment_type VARCHAR(100) NOT NULL,
        responses JSONB NOT NULL,
        results JSONB NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create university placement table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS university_placement (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        cutoff_points DECIMAL(5,2),
        eligible_courses JSONB,
        preferred_institutions JSONB,
        placement_status VARCHAR(50) DEFAULT 'pending',
        application_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Elimu Smart PostgreSQL Server is running',
    timestamp: new Date().toISOString()
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Simple password hashing (use bcrypt in production)
    const passwordHash = Buffer.from(password).toString('base64');
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, passwordHash, firstName, lastName, role]
    );
    
    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple password checking (use bcrypt in production)
    const expectedHash = Buffer.from(password).toString('base64');
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password_hash = $2',
      [email, expectedHash]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        adminRoleType: user.admin_role_type,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get student progress
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM student_progress WHERE user_id = $1',
      [userId]
    );
    
    res.json({
      success: true,
      progress: result.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update student progress
app.post('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { careerReadinessScore, activity } = req.body;
    
    // Upsert student progress
    const result = await pool.query(`
      INSERT INTO student_progress (user_id, career_readiness_score, last_activity)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        career_readiness_score = $2,
        last_activity = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, careerReadinessScore]);
    
    res.json({
      success: true,
      progress: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// KUCCPS calculation endpoint
app.post('/api/kuccps/calculate', async (req, res) => {
  try {
    const { subjects, gradePoints } = req.body;
    
    // Simple KUCCPS calculation
    let totalPoints = 0;
    let subjectCount = 0;
    
    const gradeMap = {
      'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7,
      'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
    };
    
    for (const [subject, grade] of Object.entries(gradePoints)) {
      if (subjects.includes(subject)) {
        totalPoints += gradeMap[grade] || 0;
        subjectCount++;
      }
    }
    
    const averagePoints = subjectCount > 0 ? totalPoints / subjectCount : 0;
    
    res.json({
      success: true,
      result: {
        totalPoints,
        averagePoints,
        subjectCount,
        eligibility: averagePoints >= 7.0 ? 'Eligible' : 'Not Eligible'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const port = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Initialize database
    await initializeDatabase();
    
    // Start Express server
    app.listen(port, () => {
      console.log('🚀 Elimu Smart PostgreSQL Server running on port', port);
      console.log('🗄️  Database: PostgreSQL elimu_smart_dev');
      console.log('⚡ API endpoints available at http://localhost:3001/api');
      console.log('🏥 Health check: http://localhost:3001/health');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('\n💡 Make sure PostgreSQL is running and database exists:');
    console.log('   createdb -U postgres elimu_smart_dev');
    process.exit(1);
  }
}

startServer();