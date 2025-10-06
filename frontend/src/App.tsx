import React, { Suspense, lazy } from 'react';
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

// Critical auth pages (synchronous - loaded immediately)
import LandingPage from './pages/LandingPageReplication';
import LoginPageShadcn from './pages/LoginPageShadcn';
import RegisterPage from './pages/RegisterPage';

// Lazy-loaded pages (code-split by route)
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// Student pages
const Sprint18DashboardPage = lazy(() => import('./pages/Sprint18DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Sprint18AssessmentPage = lazy(() => import('./pages/Sprint18AssessmentPage'));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));
const Sprint18GuidancePage = lazy(() => import('./pages/Sprint18GuidancePage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const InboxPage = lazy(() => import('./pages/InboxPage'));

// Assessment pages
const FreeRiasecAssessment = lazy(() => import('./components/assessments/FreeRiasecAssessment'));
const SubjectCareerMapper = lazy(() => import('./components/assessments/SubjectCareerMapper'));
const SkillsAssessment = lazy(() => import('./components/assessments/SkillsAssessment'));
const UniversityCourseFinder = lazy(() => import('./components/assessments/UniversityCourseFinder'));
const CareerExploration = lazy(() => import('./components/assessments/CareerExploration'));

// Guidance pages
const CounselorConnect = lazy(() => import('./components/guidance/CounselorConnect'));
const CounselorChat = lazy(() => import('./components/guidance/CounselorChat'));
const QuickQuestions = lazy(() => import('./components/guidance/QuickQuestions'));
const MentorshipMatching = lazy(() => import('./components/guidance/MentorshipMatching'));
const ScholarshipSearch = lazy(() => import('./components/guidance/ScholarshipSearch'));
const SkillsDevelopment = lazy(() => import('./components/guidance/SkillsDevelopment'));
const ProfessionalNetworkingHub = lazy(() => import('./components/professional/ProfessionalNetworkingHub').then(m => ({ default: m.ProfessionalNetworkingHub })));
const CommunityQA = lazy(() => import('./components/guidance/CommunityQA'));
const CareerResources = lazy(() => import('./components/guidance/CareerResources'));
const CrisisSupport = lazy(() => import('./components/guidance/CrisisSupport'));
const BookSession = lazy(() => import('./components/guidance/BookSession'));

// Counselor pages
const CounselorDashboardPage = lazy(() => import('./pages/counselor/CounselorDashboardPage'));
const CounselorToolkit = lazy(() => import('./pages/counselor/CounselorToolkit'));
const StudentsPage = lazy(() => import('./pages/counselor/StudentsPage').then(m => ({ default: m.StudentsPage })));
const QuestionsPage = lazy(() => import('./pages/counselor/QuestionsPage').then(m => ({ default: m.QuestionsPage })));
const SessionsPage = lazy(() => import('./pages/counselor/SessionsPage').then(m => ({ default: m.SessionsPage })));
const GroupSessionsPage = lazy(() => import('./pages/counselor/GroupSessionsPage').then(m => ({ default: m.GroupSessionsPage })));
const AnalyticsPage = lazy(() => import('./pages/counselor/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));

// Admin pages
const AdminPortal = lazy(() => import('./pages/admin/AdminPortal'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const SystemAnalyticsPage = lazy(() => import('./pages/admin/SystemAnalyticsPage').then(m => ({ default: m.SystemAnalyticsPage })));
const ContentModerationPage = lazy(() => import('./pages/admin/ContentModerationPage').then(m => ({ default: m.ContentModerationPage })));
const SystemConfigurationPage = lazy(() => import('./pages/admin/SystemConfigurationPage').then(m => ({ default: m.SystemConfigurationPage })));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage').then(m => ({ default: m.AuditLogPage })));
const SecurityMonitoringPage = lazy(() => import('./pages/admin/SecurityMonitoringPage').then(m => ({ default: m.SecurityMonitoringPage })));
const MaintenanceToolsPage = lazy(() => import('./pages/admin/MaintenanceToolsPage').then(m => ({ default: m.MaintenanceToolsPage })));

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
      <Suspense fallback={<LoadingOverlay visible={true} message="Loading..." />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPageShadcn />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Sprint18Layout>
      <Suspense fallback={<LoadingOverlay visible={true} message="Loading..." />}>
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
        <Route path="/guidance/community-qa" element={<CommunityQA />} />
        <Route path="/guidance/resources" element={<CareerResources />} />
        <Route path="/guidance/crisis" element={<CrisisSupport />} />
        <Route path="/guidance/book-session" element={<BookSession />} />
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
      </Suspense>
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
