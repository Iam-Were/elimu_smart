import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { Toaster } from './components/ui/sonner';
import { Sprint18Layout } from './components/layouts/Sprint18Layout';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPageReplication';
import LoginPageShadcn from './pages/LoginPageShadcn';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Sprint18DashboardPage from './pages/Sprint18DashboardPage';
import ProfilePage from './pages/ProfilePage';
import Sprint18AssessmentPage from './pages/Sprint18AssessmentPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import Sprint18GuidancePage from './pages/Sprint18GuidancePage';
import AdminPortal from './pages/admin/AdminPortal';
import CounselorToolkit from './pages/counselor/CounselorToolkit';
import { StudentsPage } from './pages/counselor/StudentsPage';
import { QuestionsPage } from './pages/counselor/QuestionsPage';
import { SessionsPage } from './pages/counselor/SessionsPage';
import { AnalyticsPage } from './pages/counselor/AnalyticsPage';
import { GroupSessionsPage } from './pages/counselor/GroupSessionsPage';
import CounselorDashboardPage from './pages/counselor/CounselorDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { SystemAnalyticsPage } from './pages/admin/SystemAnalyticsPage';
import { ContentModerationPage } from './pages/admin/ContentModerationPage';
import { SystemConfigurationPage } from './pages/admin/SystemConfigurationPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';
import { SecurityMonitoringPage } from './pages/admin/SecurityMonitoringPage';
import { MaintenanceToolsPage } from './pages/admin/MaintenanceToolsPage';
import { ProfessionalNetworkingHub } from './components/professional/ProfessionalNetworkingHub';
import FreeRiasecAssessment from './components/assessments/FreeRiasecAssessment';
import { SubscriptionPage } from './pages/SubscriptionPage';
import SubjectCareerMapper from './components/assessments/SubjectCareerMapper';
import SkillsAssessment from './components/assessments/SkillsAssessment';
import UniversityCourseFinder from './components/assessments/UniversityCourseFinder';
import CareerExploration from './components/assessments/CareerExploration';
import CounselorConnect from './components/guidance/CounselorConnect';
import QuickQuestions from './components/guidance/QuickQuestions';
import MentorshipMatching from './components/guidance/MentorshipMatching';
import ScholarshipSearch from './components/guidance/ScholarshipSearch';
import SkillsDevelopment from './components/guidance/SkillsDevelopment';
import CounselorChat from './components/guidance/CounselorChat';
import InboxPage from './pages/InboxPage';
import './styles/globals.css';

// Role-based default route component
const RoleBasedDefaultRoute: React.FC = () => {
  const { user } = useAuth();

  // Apply role-based theme on first load
  React.useEffect(() => {
    if (user?.role && typeof document !== 'undefined') {
      const body = document.body;
      body.className = body.className.replace(/theme-\w+/g, '');

      if (user.role === 'admin') {
        body.classList.add('theme-admin');
      } else if (user.role === 'counselor') {
        body.classList.add('theme-counselor');
      }
      // Students use default orange theme (no class needed)
    }
  }, [user?.role]);

  // Role-based routing
  if (user?.role === 'counselor') {
    return <Navigate to="/counselor/dashboard" replace />;
  }
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  // Default to student dashboard
  return <Navigate to="/dashboard" replace />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPageShadcn />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Sprint18Layout>
      <Routes>
        <Route path="/dashboard" element={<Sprint18DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/settings/*" element={<AccountSettingsPage />} />
        <Route path="/assessment" element={<Sprint18AssessmentPage />} />
        <Route path="/assessment/career" element={<FreeRiasecAssessment />} />
        <Route path="/assessment/subjects" element={<SubjectCareerMapper />} />
        <Route path="/assessment/skills" element={<SkillsAssessment />} />
        <Route path="/assessment/university" element={<UniversityCourseFinder />} />
        <Route path="/assessment/explore" element={<CareerExploration />} />
        <Route path="/guidance" element={<Sprint18GuidancePage />} />
        <Route path="/guidance/professional-networking" element={<ProfessionalNetworkingHub />} />
        <Route path="/guidance/counselor-connect" element={<CounselorConnect />} />
        <Route path="/guidance/chat-counselor" element={<CounselorChat />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/student/quick-questions" element={<QuickQuestions />} />
        <Route path="/student/mentorship-matching" element={<MentorshipMatching />} />
        <Route path="/student/scholarship-search" element={<ScholarshipSearch />} />
        <Route path="/student/skills-development" element={<SkillsDevelopment />} />
        <Route path="/admin/portal" element={<AdminPortal />} />
        <Route path="/counselor/dashboard" element={<CounselorDashboardPage />} />
        <Route path="/counselor/toolkit" element={<CounselorToolkit />} />
        <Route path="/counselor/students" element={<StudentsPage />} />
        <Route path="/counselor/questions" element={<QuestionsPage />} />
        <Route path="/counselor/sessions" element={<SessionsPage />} />
        <Route path="/counselor/group-sessions" element={<GroupSessionsPage />} />
        <Route path="/counselor/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/analytics" element={<SystemAnalyticsPage />} />
        <Route path="/admin/content-moderation" element={<ContentModerationPage />} />
        <Route path="/admin/system-configuration" element={<SystemConfigurationPage />} />
        <Route path="/admin/audit-log" element={<AuditLogPage />} />
        <Route path="/admin/security-monitoring" element={<SecurityMonitoringPage />} />
        <Route path="/admin/maintenance-tools" element={<MaintenanceToolsPage />} />
        {/* Role-based default routing */}
        <Route path="/" element={<RoleBasedDefaultRoute />} />
        <Route path="*" element={<RoleBasedDefaultRoute />} />
      </Routes>
    </Sprint18Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
