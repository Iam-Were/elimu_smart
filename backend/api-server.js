const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Elimu Smart API Server Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      test: '/api/test',
      auth: '/api/auth/*',
      dashboard: '/api/dashboard/*'
    }
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo authentication
  const demoUsers = {
    'student@elimu.com': { role: 'student', name: 'Alex Mwangi' },
    'counselor@elimu.com': { role: 'counselor', name: 'Sarah Kamau' },
    'admin@elimu.com': { role: 'admin', name: 'James Ochieng' }
  };
  
  if (demoUsers[email] && password === email.split('@')[0]) {
    res.json({
      success: true,
      user: demoUsers[email],
      token: 'demo_token_' + Date.now()
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Dashboard API endpoints
app.get('/api/dashboard/cards', (req, res) => {
  res.json({
    cards: [
      {
        id: 'career_readiness',
        title: 'Career Readiness Score',
        value: 87,
        change: '+5% this month',
        type: 'metric'
      },
      {
        id: 'assessments_completed',
        title: 'Assessments Completed',
        value: 4,
        change: '+2 this week',
        type: 'counter'
      },
      {
        id: 'career_matches',
        title: 'Career Matches Found',
        value: 12,
        change: 'Based on your profile',
        type: 'info'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// University placement API
app.get('/api/placement/data', (req, res) => {
  res.json({
    status: 'Eligible',
    probability: 'High (87%)',
    coursesAvailable: 23,
    change: 'Based on current grades',
    recommendations: [
      'Focus on Math and English',
      'Consider backup courses',
      'Apply early for better chances'
    ],
    timestamp: new Date().toISOString()
  });
});

// Career readiness API
app.get('/api/career/readiness', (req, res) => {
  res.json({
    score: 87,
    components: {
      assessmentCompletion: 90,
      careerResearch: 85,
      courseExploration: 80,
      actionsTaken: 92
    },
    change: '+5% this month',
    trend: 'positive',
    recommendations: [
      'Complete remaining career assessments',
      'Explore more university courses',
      'Schedule counselor session'
    ],
    timestamp: new Date().toISOString()
  });
});

// Catch all 404s
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedPath: req.path,
    method: req.method,
    availableEndpoints: ['/health', '/api/test', '/api/auth/login', '/api/dashboard/cards'],
    timestamp: new Date().toISOString()
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('🎉 Elimu Smart API Server Started Successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔗 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/cards`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Ready for Frontend Integration!');
});