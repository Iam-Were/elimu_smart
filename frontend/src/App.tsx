import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import StudentDashboard from './components/StudentDashboard'
import AdminDashboard from './components/AdminDashboard'
import CounselorDashboard from './components/CounselorDashboard'
import './App.css'

const applyRoleTheme = (role: string) => {
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.style.transition = 'all 0.3s ease-in-out';
  
  if (role === 'admin' || role === 'super_admin') {
    document.body.classList.add('theme-admin');
  } else if (role === 'counselor' || role === 'career_counselor') {
    document.body.classList.add('theme-counselor');
  }
  
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
};

function App() {
  const [userRole, setUserRole] = useState<string>('student');
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    applyRoleTheme(userRole);
  }, [userRole]);

  const handleGetStarted = (role: string = 'student') => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setCurrentView('landing');
    setUserRole('student');
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
      case 'super_admin':
        return <AdminDashboard onSignOut={handleSignOut} />;
      case 'counselor':
      case 'career_counselor':
        return <CounselorDashboard onSignOut={handleSignOut} />;
      default:
        return <StudentDashboard onSignOut={handleSignOut} />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        renderDashboard()
      )}
    </div>
  )
}

export default App
