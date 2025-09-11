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
import { Sprint18Layout } from './components/layouts/Sprint18Layout';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPageReplication';
import LoginPageShadcn from './pages/LoginPageShadcn';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import Sprint18DashboardPage from './pages/Sprint18DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
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
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { SystemAnalyticsPage } from './pages/admin/SystemAnalyticsPage';
import { ContentModerationPage } from './pages/admin/ContentModerationPage';
import { SystemConfigurationPage } from './pages/admin/SystemConfigurationPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';
import { SecurityMonitoringPage } from './pages/admin/SecurityMonitoringPage';
import { MaintenanceToolsPage } from './pages/admin/MaintenanceToolsPage';
import { ProfessionalNetworkingHub } from './components/professional/ProfessionalNetworkingHub';
import './styles/globals.css';

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
        <Route path="/settings/*" element={<AccountSettingsPage />} />
        <Route path="/assessment" element={<Sprint18AssessmentPage />} />
        <Route path="/guidance" element={<Sprint18GuidancePage />} />
        <Route path="/guidance/professional-networking" element={<ProfessionalNetworkingHub />} />
        <Route path="/admin/portal" element={<AdminPortal />} />
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
