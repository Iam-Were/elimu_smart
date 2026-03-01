import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { Toaster } from './components/ui/sonner';
import { Sprint18Layout } from './components/layouts/Sprint18Layout';
import { useAuth } from './hooks/useAuth';
import SkipNavigation from './components/common/SkipNavigation';
import { useKeyboardNavigation } from './hooks/useAccessibility';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { TrialBanner } from './components/common/TrialBanner';
import { TrialExpiryModal } from './components/common/TrialExpiryModal';
import './styles/accessibility.css';

// Critical auth pages (synchronous - loaded immediately)
import LandingPage from './pages/LandingPageReplication';
import LoginPageShadcn from './pages/LoginPageShadcn';
import RegisterPage from './pages/RegisterPage';

// Lazy-loaded pages (code-split by route)
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ConsentPage = lazy(() => import('./pages/ConsentPage').then(m => ({ default: m.ConsentPage })));
const OnboardingWizard = lazy(() => import('./components/onboarding/OnboardingWizard').then(m => ({ default: m.OnboardingWizard })));

// Student pages
const Sprint18DashboardPage = lazy(() => import('./pages/Sprint18DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePageTabbed'));
const AssessmentResultsPage = lazy(() => import('./pages/AssessmentResultsPage'));
const Sprint18AssessmentPage = lazy(() => import('./pages/Sprint18AssessmentPage'));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));
const Sprint18GuidancePage = lazy(() => import('./pages/Sprint18GuidancePageTabbed'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const BillingPage = lazy(() => import('./pages/BillingPage').then(m => ({ default: m.BillingPage })));
const InboxPage = lazy(() => import('./pages/UnifiedInboxPage'));

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
const BookSession = lazy(() => import('./components/guidance/BookSession'));
const CrisisResourcesPage = lazy(() => import('./pages/CrisisResourcesPage'));

// Counselor pages
const CounselorDashboardPage = lazy(() => import('./pages/counselor/CounselorDashboardPage'));
const CounselorProfilePage = lazy(() => import('./pages/counselor/CounselorProfilePage').then(m => ({ default: m.CounselorProfilePage })));
const CounselorToolkit = lazy(() => import('./pages/counselor/CounselorToolkit'));
const StudentsPage = lazy(() => import('./pages/counselor/StudentsPage').then(m => ({ default: m.StudentsPage })));
const QuestionsPage = lazy(() => import('./pages/counselor/QuestionsPage').then(m => ({ default: m.QuestionsPage })));
const SessionsPage = lazy(() => import('./pages/counselor/SessionsPage').then(m => ({ default: m.SessionsPage })));
const GroupSessionsPage = lazy(() => import('./pages/counselor/GroupSessionsPage').then(m => ({ default: m.GroupSessionsPage })));
const AnalyticsPage = lazy(() => import('./pages/counselor/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const DiscoverStudentsPage = lazy(() => import('./pages/counselor/DiscoverStudentsPage').then(m => ({ default: m.DiscoverStudentsPage })));

// Admin pages
const AdminPortal = lazy(() => import('./pages/admin/AdminPortal'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminContentManagementPage = lazy(() => import('./pages/admin/AdminContentManagementPage').then(m => ({ default: m.AdminContentManagementPage })));
const UniversitiesManagementPage = lazy(() => import('./pages/admin/UniversitiesManagementPage').then(m => ({ default: m.UniversitiesManagementPage })));
const CoursesManagementPage = lazy(() => import('./pages/admin/CoursesManagementPage').then(m => ({ default: m.CoursesManagementPage })));
const CareersManagementPage = lazy(() => import('./pages/admin/CareersManagementPage').then(m => ({ default: m.CareersManagementPage })));
const AssessmentQuestionsManagementPage = lazy(() => import('./pages/admin/AssessmentQuestionsManagementPage').then(m => ({ default: m.AssessmentQuestionsManagementPage })));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const SystemAnalyticsPage = lazy(() => import('./pages/admin/SystemAnalyticsPage').then(m => ({ default: m.SystemAnalyticsPage })));
const ContentModerationPage = lazy(() => import('./pages/admin/ContentModerationPage').then(m => ({ default: m.ContentModerationPage })));
const SystemConfigurationPage = lazy(() => import('./pages/admin/SystemConfigurationPage').then(m => ({ default: m.SystemConfigurationPage })));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage').then(m => ({ default: m.AuditLogPage })));
const SecurityMonitoringPage = lazy(() => import('./pages/admin/SecurityMonitoringPage').then(m => ({ default: m.SecurityMonitoringPage })));
const MaintenanceToolsPage = lazy(() => import('./pages/admin/MaintenanceToolsPage').then(m => ({ default: m.MaintenanceToolsPage })));
const SchoolsManagementPage = lazy(() => import('./pages/admin/SchoolsManagementPage').then(m => ({ default: m.SchoolsManagementPage })));

import './styles/globals.css';

// Protected Routes - checks localStorage and onboarding status
const ProtectedRoutes: React.FC = () => {
  const sessionToken = localStorage.getItem('parse-session-token');
  const storedUser = localStorage.getItem('elimu-user');
  const isAuthenticated = !!(sessionToken || storedUser);
  const [needsOnboarding, setNeedsOnboarding] = React.useState<boolean | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { getParse } = await import('./config/parse');
      const Parse = await getParse();
      const user = Parse.User.current();

      if (!user) {
        setNeedsOnboarding(false);
        return;
      }

      const role = user.get('role');
      setUserRole(role);

      // Only students need onboarding
      if (role !== 'student') {
        setNeedsOnboarding(false);
        return;
      }

      // Check onboarding status
      const preferences = await Parse.Cloud.run('getUserPreferences', {
        userId: user.id
      });

      setNeedsOnboarding(!preferences.onboardingCompleted);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setNeedsOnboarding(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show loading while checking onboarding
  if (needsOnboarding === null) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }

  // Redirect to onboarding if needed (students only)
  if (needsOnboarding && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Block students from counselor routes
  if (userRole === 'student' && window.location.pathname.startsWith('/counselor')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Sprint18Layout>
      {/* Trial banner for students with active trials */}
      {userRole === 'student' && <TrialBanner />}
      {/* Trial expiry modal */}
      {userRole === 'student' && <TrialExpiryModal />}
      <Suspense fallback={<LoadingOverlay visible={true} message="Loading..." />}>
        <Outlet />
      </Suspense>
    </Sprint18Layout>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }

  return (
    <Suspense fallback={<LoadingOverlay visible={true} message="Loading..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPageShadcn />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/consent/:token" element={<ConsentPage />} />

        {/* Onboarding route (authenticated but before main app) */}
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Protected routes - checks localStorage and onboarding status */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Sprint18DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/assessments" element={<AssessmentResultsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/pricing" element={<SubscriptionPage />} />
          <Route path="/checkout/:planId" element={<CheckoutPage />} />
          <Route path="/billing" element={<BillingPage />} />
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
          <Route path="/guidance/book-session" element={<BookSession />} />
          <Route path="/guidance/crisis" element={<CrisisResourcesPage />} />
          <Route path="/assessment/riasec" element={<FreeRiasecAssessment />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/messages" element={<InboxPage />} />
          <Route path="/student/quick-questions" element={<QuickQuestions />} />
          <Route path="/student/mentorship-matching" element={<MentorshipMatching />} />
          <Route path="/student/scholarship-search" element={<ScholarshipSearch />} />
          <Route path="/student/skills-development" element={<SkillsDevelopment />} />
          <Route path="/admin/portal" element={<AdminPortal />} />
          <Route path="/counselor/dashboard" element={<CounselorDashboardPage />} />
          <Route path="/counselor/profile" element={<CounselorProfilePage />} />
          <Route path="/counselor/toolkit" element={<CounselorToolkit />} />
          <Route path="/counselor/students" element={<StudentsPage />} />
          <Route path="/counselor/questions" element={<QuestionsPage />} />
          <Route path="/counselor/sessions" element={<SessionsPage />} />
          <Route path="/counselor/group-sessions" element={<GroupSessionsPage />} />
          <Route path="/counselor/analytics" element={<AnalyticsPage />} />
          <Route path="/counselor/discover-students" element={<DiscoverStudentsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<AdminContentManagementPage />} />
          <Route path="/admin/content/universities" element={<UniversitiesManagementPage />} />
          <Route path="/admin/content/courses" element={<CoursesManagementPage />} />
          <Route path="/admin/content/careers" element={<CareersManagementPage />} />
          <Route path="/admin/content/questions" element={<AssessmentQuestionsManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/analytics" element={<SystemAnalyticsPage />} />
          <Route path="/admin/content-moderation" element={<ContentModerationPage />} />
          <Route path="/admin/system-configuration" element={<SystemConfigurationPage />} />
          <Route path="/admin/audit-log" element={<AuditLogPage />} />
          <Route path="/admin/security-monitoring" element={<SecurityMonitoringPage />} />
          <Route path="/admin/maintenance-tools" element={<MaintenanceToolsPage />} />
          <Route path="/admin/schools" element={<SchoolsManagementPage />} />
        </Route>

        {/* Catch-all: redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  // Enable keyboard navigation detection globally
  useKeyboardNavigation();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          {/* Skip Navigation Link - WCAG 2.1 AA: 2.4.1 Bypass Blocks */}
          <SkipNavigation />
          <AppContent />
          <Toaster />
          <PwaInstallPrompt />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
