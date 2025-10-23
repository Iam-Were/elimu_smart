# Admin Roles & RBAC Plan

**Date**: 2025-10-22
**Priority**: MEDIUM (After Counselor Journey)
**Current Status**: Functional Mantine/shadcn hybrid, needs RBAC enforcement

---

## 🎯 Executive Summary

### Current State Assessment

**✅ What's Working:**
1. **Admin Portal Exists** - Landing page with 9 admin tools
2. **Purple Theme** - Consistent across admin interfaces
3. **3 RBAC Roles Defined**:
   - Mike Kamau (Platform Admin) - `mike.platform@elimu.com`
   - Linda Wambui (Operations Admin) - `linda.operations@elimu.com`
   - Peter Otieno (Safety Manager) - `peter.safety@elimu.com`
4. **Backend Integration** - 9 Cloud Functions for admin dashboards
5. **Mantine + shadcn Hybrid** - Functional but inconsistent

**⚠️ Critical Gaps:**
1. **No RBAC Enforcement** - All admins see all tools (security risk)
2. **No Role-Based Permissions** - Backend doesn't restrict access by role
3. **Mixed UI Libraries** - Mantine tables, shadcn buttons (tech debt)
4. **No Audit Logging** - Can't track who did what action
5. **No Admin Activity Dashboard** - No visibility into admin actions
6. **Desktop-Only Design** - Not mobile-optimized (admins may use tablets)

---

## 🔐 RBAC Role Definitions

### **Role 1: Platform Admin (Superuser)**

**Persona**: Mike Kamau - Technical platform manager

**Responsibilities**:
- System configuration and settings
- User account management (create/suspend/delete)
- Database management and migrations
- API integrations and external services
- Performance monitoring and optimization
- Security audit logs

**Dashboard Access**:
- ✅ User Management
- ✅ System Analytics
- ✅ Database Management
- ✅ Audit Logs
- ✅ Security Metrics
- ✅ API Configuration
- ❌ Content Moderation (delegated to Operations)
- ❌ Provider Safety (delegated to Safety Manager)

**Permissions** (Backend ACL):
```javascript
platformAdmin: {
  users: ['read', 'create', 'update', 'delete', 'suspend'],
  system: ['read', 'configure', 'restart', 'migrate'],
  database: ['read', 'query', 'backup', 'restore'],
  logs: ['read', 'export'],
  security: ['read', 'configure', 'audit'],
  content: ['read'], // View only
  counselors: ['read'] // View only
}
```

**Risk Level**: CRITICAL - Full system access

---

### **Role 2: Operations Admin**

**Persona**: Linda Wambui - Daily operations manager

**Responsibilities**:
- Content moderation (Q&A, messages, posts)
- User support and issue resolution
- Student/counselor account verification
- Scholarship/resource management
- Business metrics tracking
- Revenue and subscription analytics

**Dashboard Access**:
- ✅ Content Moderation
- ✅ Support Tickets (future)
- ✅ User Verification
- ✅ Business Metrics
- ✅ Revenue Analytics
- ❌ System Configuration
- ❌ Database Access
- ❌ Audit Logs (read-only via Platform Admin)

**Permissions** (Backend ACL):
```javascript
operationsAdmin: {
  users: ['read', 'update', 'verify'], // Can't delete
  content: ['read', 'moderate', 'flag', 'remove'],
  support: ['read', 'respond', 'escalate'],
  resources: ['read', 'create', 'update', 'delete'],
  metrics: ['read'],
  revenue: ['read'],
  system: ['read'], // View-only
  security: ['read'] // View-only
}
```

**Risk Level**: MEDIUM - Content and user management

---

### **Role 3: Provider Safety Manager**

**Persona**: Peter Otieno - Counselor compliance and safety

**Responsibilities**:
- Counselor background verification
- License and credential validation
- Safety incident response
- Student protection protocols
- Counselor performance monitoring
- Compliance reporting

**Dashboard Access**:
- ✅ Counselor Verification
- ✅ Safety Incidents
- ✅ Compliance Reports
- ✅ Counselor Performance (safety metrics only)
- ❌ User Management
- ❌ System Configuration
- ❌ Revenue Analytics
- ❌ Content Moderation (except safety-related)

**Permissions** (Backend ACL):
```javascript
safetyManager: {
  counselors: ['read', 'verify', 'suspend', 'flag'],
  incidents: ['read', 'create', 'update', 'resolve'],
  compliance: ['read', 'generate_reports'],
  students: ['read'], // Safety context only
  content: ['read', 'flag'], // Safety issues only
  users: ['read'], // View-only
  system: ['read'], // View-only
  metrics: ['read'] // Safety metrics only
}
```

**Risk Level**: MEDIUM - Counselor management, student safety

---

## 🗺️ Admin User Journeys

### **Journey 1: Platform Admin - System Health Check (Daily)**

**Scenario**: Mike logs in every morning to check system status

#### Proposed Flow (4 steps):
1. Login → **Platform Admin Dashboard**
   - System Health Card (CPU, RAM, Disk, DB status)
   - User Growth Card (new registrations, daily active users)
   - Error Rate Card (API errors, failed jobs)
   - Security Alerts Card (failed logins, suspicious activity)
2. Click "System Health" → Detailed metrics page
   - Real-time server metrics (PM2, PostgreSQL, Redis)
   - Parse Cloud Function performance
   - External API health (M-Pesa, ZeptoMail, CareerJet)
3. Click "Audit Logs" → Recent admin actions
   - Filter by: Admin user, Action type, Date range
   - Export CSV for compliance
4. Take action if needed (restart service, investigate error)

**Backend Functions Needed**:
- `getSystemMetrics` ✅ (already integrated)
- `getAuditLogs` ✅ (already integrated)
- `getSecurityMetrics` ✅ (already integrated)
- `restartService` ❌ (needs implementation)

---

### **Journey 2: Operations Admin - Content Moderation (Daily)**

**Scenario**: Linda reviews flagged content and user reports

#### Proposed Flow (5 steps):
1. Login → **Operations Admin Dashboard**
   - Flagged Content Card (12 items requiring review)
   - User Reports Card (5 new reports)
   - Pending Verifications Card (8 counselors awaiting approval)
   - Business Metrics Card (revenue, subscriptions, conversions)
2. Click "Flagged Content" → Content Moderation Queue
   - Filter by: Type (Q&A, Message, Post), Severity, Date
   - Each item shows:
     - Content preview
     - Reporter info
     - Timestamp
     - Severity (Low/Medium/High)
3. Click flagged item → **Content Review Sheet** (bottom sheet)
   - Full content display
   - User context (history, account status)
   - Actions: Approve, Remove, Warn User, Ban User
4. Take action → Auto-notify user + log to audit
5. Next item (keyboard shortcuts: ← → for navigation)

**Backend Functions Needed**:
- `getFlaggedContent` ❌ (needs implementation)
- `moderateContent` ❌ (needs implementation)
- `getUserReports` ❌ (needs implementation)
- `sendModerationNotification` ❌ (needs implementation)

---

### **Journey 3: Safety Manager - Counselor Verification (Weekly)**

**Scenario**: Peter verifies new counselor credentials

#### Proposed Flow (6 steps):
1. Login → **Safety Manager Dashboard**
   - Pending Counselors Card (8 awaiting verification)
   - Safety Incidents Card (2 active incidents)
   - Compliance Reports Card (monthly report due in 5 days)
   - Counselor Performance Card (top performers + red flags)
2. Click "Pending Counselors" → Verification Queue
   - Table: Name, Email, License #, Submitted Date, Documents
   - Sort by: Date (oldest first), Urgency
3. Click counselor → **Verification Sheet**
   - Profile summary (education, experience, references)
   - Uploaded documents:
     - License certificate (PDF viewer)
     - Educational credentials
     - Background check results
   - Verification checklist:
     - [ ] License valid (check KAPC database)
     - [ ] Education verified
     - [ ] Background check clear
     - [ ] References contacted
4. Take action:
   - ✅ Approve → Activate counselor account + send welcome email
   - ❌ Reject → Send rejection reason + allow resubmit
   - ⏸️ Request More Info → Email counselor with requirements
5. Auto-log to audit trail
6. Move to next counselor

**Backend Functions Needed**:
- `getPendingCounselors` ❌ (needs implementation)
- `verifyCounselor` ❌ (needs implementation)
- `getSafetyIncidents` ❌ (needs implementation)
- `generateComplianceReport` ❌ (needs implementation)

---

## 🎨 Design System for Admins

### **Purple Theme (#9333ea) Hierarchy**

Following student/counselor pattern but with admin purple:

| Element | Color | Usage |
|---------|-------|-------|
| Primary Actions | `bg-purple-600 hover:bg-purple-700` | CTAs, active states |
| Role Badges | Role-specific gradients (see below) | Distinguish admin types |
| Cards | `border-purple-200 bg-purple-50/50` | Card backgrounds |
| Icon Gradients | `from-purple-500 to-purple-600` | Default admin cards |
| Critical Actions | `from-red-500 to-red-600` | Delete, ban, suspend |
| Success | `from-green-500 to-green-600` | Approve, verify |
| Neutral | `from-gray-500 to-gray-600` | Informational |

### **Role-Specific Color Coding**

Differentiate admin types at a glance:

| Role | Badge Gradient | Use Case |
|------|----------------|----------|
| Platform Admin | `from-purple-600 to-indigo-600` | System/technical cards |
| Operations Admin | `from-blue-600 to-cyan-600` | Content/business cards |
| Safety Manager | `from-orange-600 to-red-600` | Safety/compliance cards |

### **RBAC UI Patterns**

**Permission Gating** (Frontend):
```typescript
import { useAdminRole } from '@/hooks/useAdminRole';

const AdminDashboard = () => {
  const { role, hasPermission } = useAdminRole();

  return (
    <div>
      {/* Visible to all admins */}
      <UserStatisticsCard />

      {/* Platform Admin only */}
      {hasPermission('system:configure') && (
        <SystemConfigCard />
      )}

      {/* Operations Admin only */}
      {hasPermission('content:moderate') && (
        <ContentModerationCard />
      )}

      {/* Safety Manager only */}
      {hasPermission('counselors:verify') && (
        <CounselorVerificationCard />
      )}
    </div>
  );
};
```

**Backend ACL Enforcement**:
```javascript
// backend/cloud/admin/rbac.js
Parse.Cloud.define('getSystemMetrics', async (request) => {
  const { user } = request;

  // Check if user has platformAdmin role
  const hasPermission = await checkAdminPermission(user, 'system:read');
  if (!hasPermission) {
    throw new Parse.Error(403, 'Insufficient permissions');
  }

  // Return metrics...
});
```

---

## 🛠️ Implementation Phases

### **Phase 1: RBAC Backend Foundation** (Priority: CRITICAL)

**Estimated Time**: 4-6 hours

**Tasks**:
1. Create `backend/utils/rbac.js` permission system
2. Define role-permission mappings (as above)
3. Add `checkAdminPermission(user, permission)` helper
4. Protect all admin Cloud Functions with permission checks
5. Add audit logging to all admin actions

**File Changes**:
- `backend/utils/rbac.js` (NEW)
- `backend/cloud/adminFunctions.js` (UPDATE - add permission checks)
- `backend/cloud/auditLog.js` (NEW)

**Database Changes**:
- Add `adminRole` field to _User class (platformAdmin/operationsAdmin/safetyManager)
- Create `AuditLog` Parse Class (user, action, timestamp, details, ipAddress)

---

### **Phase 2: Frontend RBAC Hook** (Priority: HIGH)

**Estimated Time**: 2-3 hours

**Tasks**:
1. Create `useAdminRole()` hook
2. Add `hasPermission(permission)` helper
3. Create permission-gated components
4. Add role badges to admin header

**File Changes**:
- `frontend/src/hooks/useAdminRole.ts` (NEW)
- `frontend/src/components/admin/RoleGuard.tsx` (NEW)
- `frontend/src/layouts/AdminLayout.tsx` (UPDATE - add role badge)

**Example Hook**:
```typescript
// frontend/src/hooks/useAdminRole.ts
export const useAdminRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    if (user?.adminRole) {
      setRole(user.adminRole);
    }
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    const [resource, action] = permission.split(':');
    return ROLE_PERMISSIONS[role]?.[resource]?.includes(action) || false;
  };

  return { role, hasPermission, isAdmin: !!role };
};
```

---

### **Phase 3: Role-Specific Dashboards** (Priority: HIGH)

**Estimated Time**: 6-8 hours

**Tasks**:

#### **3.1: Platform Admin Dashboard**
- System Health Card (PM2, PostgreSQL, Redis)
- User Growth Card (registrations, DAU)
- Error Rate Card (API failures)
- Security Alerts Card (failed logins)
- Audit Logs Table (recent admin actions)

#### **3.2: Operations Admin Dashboard**
- Flagged Content Card (moderation queue)
- User Reports Card (support requests)
- Business Metrics Card (revenue, conversions)
- Pending Verifications Card (counselor approvals)

#### **3.3: Safety Manager Dashboard**
- Pending Counselors Card (verification queue)
- Safety Incidents Card (active incidents)
- Compliance Reports Card (monthly/quarterly)
- Counselor Performance Card (red flags)

**File Changes**:
- `frontend/src/pages/admin/PlatformAdminDashboard.tsx` (NEW)
- `frontend/src/pages/admin/OperationsAdminDashboard.tsx` (NEW)
- `frontend/src/pages/admin/SafetyManagerDashboard.tsx` (NEW)

---

### **Phase 4: Content Moderation Queue** (Priority: MEDIUM)

**Estimated Time**: 4-5 hours

**Tasks**:
1. Create `ContentModerationQueue.tsx` component
2. Add filtering (type, severity, date)
3. Create `ContentReviewSheet.tsx` bottom sheet
4. Add moderation actions (approve/remove/warn/ban)
5. Implement keyboard shortcuts (← → navigation)
6. Add auto-refresh (every 30 seconds)

**Backend Functions**:
```javascript
// backend/cloud/admin/moderation.js
Parse.Cloud.define('getFlaggedContent', async (request) => {
  requirePermission(request.user, 'content:read');
  // Return flagged items...
});

Parse.Cloud.define('moderateContent', async (request) => {
  requirePermission(request.user, 'content:moderate');
  const { contentId, action, reason } = request.params;

  // Log action
  await logAuditAction(request.user, 'moderate_content', { contentId, action });

  // Take action (remove, warn, etc.)
  // Send notification to user
});
```

---

### **Phase 5: Counselor Verification Flow** (Priority: MEDIUM)

**Estimated Time**: 5-6 hours

**Tasks**:
1. Create `CounselorVerificationQueue.tsx`
2. Create `VerificationSheet.tsx` with document viewer
3. Add verification checklist
4. Integrate with backend verification functions
5. Add approval/rejection workflow
6. Send automated emails (welcome/rejection/request-info)

**Backend Functions**:
```javascript
Parse.Cloud.define('getPendingCounselors', async (request) => {
  requirePermission(request.user, 'counselors:read');
  // Return counselors with status='pending_verification'
});

Parse.Cloud.define('verifyCounselor', async (request) => {
  requirePermission(request.user, 'counselors:verify');
  const { counselorId, approved, reason } = request.params;

  // Update counselor status
  // Send email
  // Log audit action
});
```

---

### **Phase 6: Audit Logging & Compliance** (Priority: HIGH)

**Estimated Time**: 3-4 hours

**Tasks**:
1. Create `AuditLogViewer.tsx` component
2. Add filtering (admin user, action type, date range)
3. Add export to CSV
4. Create `ComplianceReportGenerator.tsx`
5. Auto-generate monthly safety reports

**Audit Log Schema**:
```javascript
{
  objectId: string,
  adminUser: Pointer<_User>,
  adminRole: string, // platformAdmin/operationsAdmin/safetyManager
  action: string, // 'delete_user', 'moderate_content', 'verify_counselor'
  targetType: string, // 'User', 'Question', 'Counselor'
  targetId: string,
  details: object, // Action-specific data
  ipAddress: string,
  timestamp: Date
}
```

---

## 📊 Backend Functions Needed

### **Already Integrated (9 functions)**
- `logAdminActivity` ✅
- `getAdminSystemMetrics` ✅
- `getAdminSecurityMetrics` ✅
- `getAdminBusinessMetrics` ✅
- `getAdminContentMetrics` ✅
- `getAdminSupportMetrics` ✅
- `getAdminAuditLogs` ✅
- `getAdminRecentActivities` ✅
- `getAdminBillingAnalytics` ✅

### **High Priority (Need Implementation)**
1. `getFlaggedContent` - Content moderation queue
2. `moderateContent` - Approve/remove/warn/ban actions
3. `getPendingCounselors` - Verification queue
4. `verifyCounselor` - Approve/reject counselors
5. `checkAdminPermission` - RBAC enforcement (utility)
6. `logAuditAction` - Audit trail logging (utility)
7. `getUserReports` - Support tickets/reports
8. `getSafetyIncidents` - Safety incident queue

### **Medium Priority**
9. `generateComplianceReport` - Monthly safety reports
10. `sendModerationNotification` - Auto-notify users
11. `restartService` - PM2 service management
12. `getDatabaseHealth` - PostgreSQL metrics

---

## 🔒 Security Considerations

### **1. Session Security**
- Admin sessions expire after 2 hours (vs 7 days for students)
- Require re-authentication for critical actions (delete user, system restart)
- IP whitelisting for admin access (optional, configurable)

### **2. Audit Trail**
- Log ALL admin actions (read/write)
- Immutable audit logs (append-only)
- Monthly export to external storage (AWS S3 or similar)

### **3. Two-Factor Authentication** (Future)
- Require 2FA for all admin accounts
- Use SMS or TOTP (Google Authenticator)

### **4. Permission Escalation Prevention**
- Admins can't change their own role
- Only Platform Admin can modify other admin roles
- All role changes logged

---

## 📋 Implementation Checklist

### **Phase 1: RBAC Backend** (4-6 hours)
- [ ] Create `backend/utils/rbac.js`
- [ ] Define role-permission mappings
- [ ] Add `checkAdminPermission()` helper
- [ ] Protect all admin Cloud Functions
- [ ] Create `AuditLog` Parse Class
- [ ] Add `logAuditAction()` to all admin functions
- [ ] Test permission enforcement (all 3 roles)

### **Phase 2: Frontend RBAC** (2-3 hours)
- [ ] Create `useAdminRole()` hook
- [ ] Create `RoleGuard` component
- [ ] Add role badge to admin header
- [ ] Update AdminLayout with role detection
- [ ] Test permission gating in UI

### **Phase 3: Role Dashboards** (6-8 hours)
- [ ] Create PlatformAdminDashboard
- [ ] Create OperationsAdminDashboard
- [ ] Create SafetyManagerDashboard
- [ ] Integrate with backend metrics functions
- [ ] Add real-time updates (polling or websockets)

### **Phase 4: Content Moderation** (4-5 hours)
- [ ] Create ContentModerationQueue component
- [ ] Create ContentReviewSheet
- [ ] Implement `getFlaggedContent` backend
- [ ] Implement `moderateContent` backend
- [ ] Add keyboard shortcuts
- [ ] Test moderation workflow

### **Phase 5: Counselor Verification** (5-6 hours)
- [ ] Create CounselorVerificationQueue
- [ ] Create VerificationSheet with PDF viewer
- [ ] Implement `getPendingCounselors` backend
- [ ] Implement `verifyCounselor` backend
- [ ] Add email notifications
- [ ] Test approval/rejection flow

### **Phase 6: Audit & Compliance** (3-4 hours)
- [ ] Create AuditLogViewer
- [ ] Add CSV export
- [ ] Create ComplianceReportGenerator
- [ ] Test audit log accuracy
- [ ] Schedule monthly report generation

---

## 🎯 Success Metrics

### **Security**
- 100% of admin actions logged to audit trail
- 0 permission bypass incidents
- Admin session duration: 2 hours (vs 7 days for students)

### **Efficiency**
- Content moderation time: 15 min/day (down from 45 min with manual process)
- Counselor verification time: 10 min/counselor (down from 30 min)
- System health check: 2 min/day (automated alerts reduce manual checks)

### **Compliance**
- Monthly safety reports auto-generated (100% on-time)
- Audit trail retention: 5 years (compliance requirement)
- Admin role distribution: 1 Platform, 2 Operations, 1 Safety (4 total)

---

## 🚀 Migration Plan

### **Step 1: Seed Admin Roles**
```javascript
// backend/migrations/seed-admin-roles.js
const seedAdminRoles = async () => {
  const users = [
    { email: 'mike.platform@elimu.com', role: 'platformAdmin' },
    { email: 'linda.operations@elimu.com', role: 'operationsAdmin' },
    { email: 'peter.safety@elimu.com', role: 'safetyManager' }
  ];

  for (const u of users) {
    const user = await new Parse.Query('_User')
      .equalTo('email', u.email)
      .first({ useMasterKey: true });

    if (user) {
      user.set('adminRole', u.role);
      await user.save(null, { useMasterKey: true });
      console.log(`✅ Set ${u.email} to ${u.role}`);
    }
  }
};
```

### **Step 2: Test RBAC Enforcement**
1. Login as Mike (Platform Admin) → Should see all cards
2. Login as Linda (Operations Admin) → Should NOT see system config
3. Login as Peter (Safety Manager) → Should NOT see revenue analytics
4. Attempt API call without permission → Should return 403

### **Step 3: Deploy to Staging**
1. Run migration script
2. Deploy backend with RBAC
3. Deploy frontend with role dashboards
4. Test all 3 admin accounts

### **Step 4: Production Rollout**
1. Announce to admins 1 week in advance
2. Deploy during low-traffic window (2 AM EAT)
3. Monitor audit logs for errors
4. Provide admin training documentation

---

## 📚 Documentation Needed

### **For Admins**
1. **Admin User Guide** - How to use each dashboard
2. **RBAC Permission Matrix** - What each role can/can't do
3. **Content Moderation Guidelines** - When to approve/remove
4. **Counselor Verification Checklist** - Step-by-step process

### **For Developers**
1. **RBAC Implementation Guide** - How to add new permissions
2. **Audit Logging Best Practices** - What to log, how to query
3. **Admin API Reference** - All admin Cloud Functions

---

## 🔮 Future Enhancements (Phase 7+)

1. **Real-time Notifications** - Push alerts for urgent admin actions
2. **Admin Mobile App** - React Native app for on-the-go moderation
3. **AI-Assisted Moderation** - Auto-flag inappropriate content
4. **Admin Analytics Dashboard** - Track admin productivity metrics
5. **Bulk Actions** - Approve/reject multiple items at once
6. **Advanced Filtering** - Saved filters, custom queries
7. **Webhooks** - Integrate with Slack/Discord for alerts

---

**Last Updated**: 2025-10-22
**Estimated Total Time**: 24-32 hours
**Priority**: MEDIUM (After Counselor Journey)
**Security Impact**: CRITICAL - RBAC prevents unauthorized access
