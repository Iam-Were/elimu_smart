# Counselor Backend Integration Guide
**Implementation Date:** October 31, 2025  
**Status:** ✅ Phase 1 & 2 Complete | 🔄 Phase 3-5 Pending  
**Deployed:** Production (ubuntu@3.91.52.5)

---

## 🎯 Overview

This guide documents the complete backend integration for counselor workflows, addressing the critical gaps identified in the counselor user journey. These Cloud Functions enable counselors to manage sessions, students, availability, messaging, and analytics.

---

## ✅ Phase 1: Session Management (COMPLETED)

### Backend Cloud Functions

#### 1. `updateSessionStatus`
**Purpose:** Update session status and notify students

**Parameters:**
```typescript
{
  sessionId: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'pending';
  notes?: string;
  outcomes?: any;
  cancellationReason?: string;
}
```

**Returns:**
```typescript
{
  success: true;
  session: {
    id: string;
    status: string;
    studentId: string;
    scheduledTime: Date;
    topic: string;
    notes: string;
    completedAt?: Date;
    outcomes?: any;
  }
}
```

**Features:**
- ✅ Validates counselor ownership
- ✅ Sends student notifications
- ✅ Tracks completion timestamp
- ✅ Stores cancellation reasons

**Example:**
```typescript
const result = await Parse.Cloud.run('updateSessionStatus', {
  sessionId: 'abc123',
  status: 'completed',
  notes: 'Discussed university application strategy. Student is focused on engineering programs.',
  outcomes: {
    clarity: 'high',
    nextSteps: ['Research 5 universities', 'Prepare personal statement draft']
  }
});
```

---

#### 2. `rescheduleSession`
**Purpose:** Move session to new time and notify student

**Parameters:**
```typescript
{
  sessionId: string;
  newTime: Date;
  reason?: string;
}
```

**Validation:**
- ✅ Prevents rescheduling to past dates
- ✅ Verifies counselor ownership
- ✅ Sends rescheduling notification

**Example:**
```typescript
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const result = await Parse.Cloud.run('rescheduleSession', {
  sessionId: 'abc123',
  newTime: tomorrow,
  reason: 'Counselor schedule conflict'
});
```

---

#### 3. `addSessionNotes`
**Purpose:** Add private counselor notes to sessions

**Parameters:**
```typescript
{
  sessionId: string;
  notes?: string;
  nextSteps?: string;
  resources?: string[];
  outcomes?: any;
}
```

**Use Cases:**
- During session: Quick notes
- Post-session: Detailed summary
- Follow-up planning: Next steps
- Resource sharing: Links, documents

**Example:**
```typescript
await Parse.Cloud.run('addSessionNotes', {
  sessionId: 'abc123',
  notes: 'Student showed strong interest in biomedical engineering. Parents supportive.',
  nextSteps: 'Schedule follow-up in 2 weeks to review university shortlist',
  resources: [
    'https://university-guide.ke/biomedical-engineering',
    'KCSE requirements checklist'
  ]
});
```

---

#### 4. `getSessionDetails`
**Purpose:** Retrieve complete session information including student details

**Returns:**
```typescript
{
  success: true;
  session: {
    id: string;
    status: string;
    scheduledTime: Date;
    duration: number;
    topic: string;
    type: string;
    notes: string;
    nextSteps: string;
    sharedResources: string[];
    outcomes: any;
    completedAt?: Date;
    createdAt: Date;
    student: {
      id: string;
      name: string;
      email: string;
      phone: string;
      subscriptionTier: string;
    }
  }
}
```

---

### Frontend React Hook: `useSessionManagement`

**Location:** `frontend/src/hooks/counselor/useSessionManagement.ts`

**Usage:**
```tsx
import { useSessionManagement } from '@/hooks/counselor/useSessionManagement';

function SessionCard({ sessionId }) {
  const {
    confirmSession,
    cancelSession,
    completeSession,
    rescheduleSession,
    addSessionNotes,
    getSessionDetails,
    isLoading,
    error
  } = useSessionManagement();

  const handleConfirm = async () => {
    try {
      await confirmSession(sessionId, 'Session confirmed for tomorrow at 2pm');
      // Refresh session list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleConfirm} disabled={isLoading}>
        Confirm Session
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

**Available Methods:**
- `confirmSession(sessionId, notes?)` - Quick confirm
- `cancelSession(sessionId, reason)` - Cancel with reason
- `completeSession(sessionId, notes?, outcomes?)` - Mark complete
- `rescheduleSession({ sessionId, newTime, reason? })` - Reschedule
- `addSessionNotes({ sessionId, notes?, nextSteps?, resources? })` - Add notes
- `getSessionDetails(sessionId)` - Get full info

---

## ✅ Phase 2: Student Management (COMPLETED)

### Backend Cloud Functions

#### 1. `updateStudentPriority`
**Purpose:** Flag students by urgency level

**Parameters:**
```typescript
{
  studentId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
}
```

**Creates/Updates:** `CounselorStudent` relationship table

**Example:**
```typescript
await Parse.Cloud.run('updateStudentPriority', {
  studentId: 'student123',
  priority: 'urgent',
  reason: 'Struggling with career direction, needs immediate support'
});
```

---

#### 2. `addStudentNote`
**Purpose:** Add private counselor notes about students

**Parameters:**
```typescript
{
  studentId: string;
  note: string;
  isPrivate?: boolean; // default: true
  tags?: string[];
}
```

**Creates:** `StudentNote` record (private to counselor)

**Example:**
```typescript
await Parse.Cloud.run('addStudentNote', {
  studentId: 'student123',
  note: 'Parents are pressuring student toward medicine, but student shows strong artistic aptitude. Need to discuss with family.',
  isPrivate: true,
  tags: ['family-dynamics', 'career-conflict', 'follow-up']
});
```

---

#### 3. `getStudentAssessmentResults`
**Purpose:** View student's completed assessments (for counselor review)

**Returns:**
```typescript
{
  success: true;
  student: {
    id: string;
    name: string;
    email: string;
  };
  assessments: Array<{
    id: string;
    type: 'riasec';
    title: string;
    completedAt: Date;
    hollandCode: string;
    primaryType: string;
    scores: Record<string, number>;
    careerMatches: Array<{
      title: string;
      matchScore: number;
    }>;
  }>;
  summary: {
    hollandCode: string;
    primaryType: string;
    assessmentsCompleted: number;
    profileCompletion: number;
  }
}
```

**Example:**
```typescript
const results = await Parse.Cloud.run('getStudentAssessmentResults', {
  studentId: 'student123'
});

console.log(results.summary.hollandCode); // 'RIA' (Realistic, Investigative, Artistic)
console.log(results.assessments[0].careerMatches); // Top 5 career matches
```

---

#### 4. `trackStudentProgress`
**Purpose:** Track student milestones and achievements

**Parameters:**
```typescript
{
  studentId: string;
  milestone: string; // 'assessment_completed', 'career_decided', 'application_submitted', etc.
  status: 'achieved' | 'in_progress' | 'not_started';
  metadata?: any;
}
```

**Creates/Updates:** `StudentMilestone` record

**Common Milestones:**
- `assessment_completed` - Finished RIASEC/Skills assessment
- `career_decided` - Chose career path
- `university_shortlisted` - Created university list
- `application_submitted` - Submitted first application
- `offer_received` - Got university offer

**Example:**
```typescript
await Parse.Cloud.run('trackStudentProgress', {
  studentId: 'student123',
  milestone: 'career_decided',
  status: 'achieved',
  metadata: {
    chosenCareer: 'Biomedical Engineering',
    confidence: 'high',
    decidedAt: new Date()
  }
});
```

---

#### 5. `getStudentNotes`
**Purpose:** Retrieve all counselor notes for a student

**Returns:**
```typescript
{
  success: true;
  notes: Array<{
    id: string;
    content: string;
    isPrivate: boolean;
    tags: string[];
    createdAt: Date;
  }>
}
```

---

### Frontend React Hook: `useStudentManagement`

**Location:** `frontend/src/hooks/counselor/useStudentManagement.ts`

**Usage:**
```tsx
import { useStudentManagement } from '@/hooks/counselor/useStudentManagement';

function StudentCard({ studentId }) {
  const {
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    trackStudentProgress,
    getStudentNotes,
    flagAsUrgent,
    achieveMilestone,
    isLoading,
    error
  } = useStudentManagement();

  const handleFlagUrgent = async () => {
    await flagAsUrgent(studentId, 'Student expressed suicidal ideation');
    // Trigger urgent workflow
  };

  const handleViewAssessments = async () => {
    const results = await getStudentAssessmentResults(studentId);
    console.log(results.summary.hollandCode);
  };

  return (
    <div>
      <button onClick={handleFlagUrgent}>Flag as Urgent</button>
      <button onClick={handleViewAssessments}>View Assessments</button>
    </div>
  );
}
```

**Available Methods:**
- `updateStudentPriority({ studentId, priority, reason? })` - Set priority
- `flagAsUrgent(studentId, reason)` - Quick urgent flag
- `addStudentNote({ studentId, note, isPrivate?, tags? })` - Add note
- `getStudentAssessmentResults(studentId)` - View assessments
- `trackStudentProgress({ studentId, milestone, status, metadata? })` - Track milestone
- `achieveMilestone(studentId, milestone, metadata?)` - Quick achieve
- `getStudentNotes(studentId)` - Get all notes

---

## 📊 Example Component Usage

**Location:** `frontend/src/components/counselor/SessionManagementExamples.tsx`

### SessionActions Component
```tsx
<SessionActions
  sessionId="abc123"
  sessionStatus="pending"
  studentId="student123"
  studentName="John Mwangi"
  onUpdate={() => refetchSessions()}
/>
```

**Features:**
- ✅ Confirm/Cancel buttons for pending sessions
- ✅ Complete button with notes textarea
- ✅ Save notes independently
- ✅ Loading states
- ✅ Error handling

### StudentManagementPanel Component
```tsx
<StudentManagementPanel
  studentId="student123"
  studentName="Sarah Njeri"
  currentPriority="medium"
/>
```

**Features:**
- ✅ Priority level buttons (low/medium/high/urgent)
- ✅ Flag urgent with reason prompt
- ✅ View assessments (Holland Code, primary type)
- ✅ Add private notes with tags
- ✅ Real-time loading states

---

## 🔄 Phase 3: Availability & Calendar (PENDING)

### Planned Cloud Functions

1. **`setAvailability`** - Set weekly schedule
2. **`blockTimeSlot`** - Block specific times
3. **`getAvailableSlots`** - Get bookable slots
4. **Cal.com API Integration** - Sync external calendar

---

## 🔄 Phase 4: Messaging & Outreach (PENDING)

### Planned Cloud Functions

1. **`sendBulkMessage`** - Message multiple students
2. **`createMessageTemplate`** - Save reusable templates
3. **`sendProactiveMessage`** - Initiate conversations

---

## 🔄 Phase 5: Analytics & Reports (PENDING)

### Planned Cloud Functions

1. **`generateStudentReport`** - PDF/JSON student progress report
2. **`getRevenueAnalytics`** - Earnings breakdown by tier/session type
3. **`exportSessionHistory`** - Export session data

---

## 🚀 Deployment Status

### ✅ Production (October 31, 2025)
- **Backend:** Parse Server restarted with Phase 1 & 2 functions
- **Frontend:** Hooks and example components committed
- **Commits:**
  - `a7bf073` - Backend Phase 1 & 2 Cloud Functions
  - `260fddb` - Frontend hooks and example components

### 📋 Next Steps
1. Integrate hooks into existing counselor dashboard
2. Add session actions to CounselorDashboardPage
3. Create student detail modal with StudentManagementPanel
4. Implement Phase 3 (Availability & Calendar)
5. Implement Phase 4 (Messaging & Outreach)
6. Implement Phase 5 (Analytics & Reports)

---

## 🎯 Integration Checklist

### Session Management Integration
- [ ] Add SessionActions to session list items
- [ ] Create session detail modal
- [ ] Add reschedule button with date picker
- [ ] Implement session completion workflow
- [ ] Show success/error toasts

### Student Management Integration
- [ ] Add priority badges to student cards
- [ ] Create student detail sidebar
- [ ] Add notes section to student profile
- [ ] Show assessment results in expandable section
- [ ] Track milestone achievements with timeline

### Dashboard Updates
- [ ] Filter students by priority
- [ ] Show urgent students prominently
- [ ] Add quick actions menu
- [ ] Display recent notes
- [ ] Show completion metrics

---

## 📚 Database Schema Updates

### New Tables Created

**`CounselorStudent`** (Relationship table)
- `counselorId` (string)
- `studentId` (string)
- `priority` ('low' | 'medium' | 'high' | 'urgent')
- `priorityReason` (string)
- `priorityUpdatedAt` (Date)
- `status` ('active' | 'inactive')
- `assignedAt` (Date)

**`StudentNote`** (Private counselor notes)
- `counselorId` (string)
- `studentId` (string)
- `content` (text)
- `isPrivate` (boolean)
- `tags` (array of strings)
- `createdAt` (Date)

**`StudentMilestone`** (Progress tracking)
- `studentId` (string)
- `milestoneType` (string)
- `status` ('achieved' | 'in_progress' | 'not_started')
- `achievedAt` (Date)
- `metadata` (object)
- `createdBy` (string - counselor ID)
- `updatedBy` (string - counselor ID)

### Updated Tables

**`Session`** (Enhanced fields)
- `counselorNotes` (text) - Private notes
- `nextSteps` (text) - Recommended next steps
- `sharedResources` (array) - Resources shared during session
- `outcomes` (object) - Session outcomes
- `completedAt` (Date) - Completion timestamp
- `notesUpdatedAt` (Date) - Notes last updated
- `rescheduledAt` (Date) - Reschedule timestamp
- `rescheduledBy` ('counselor' | 'student')
- `rescheduleReason` (string)
- `cancellationReason` (string)
- `cancelledBy` ('counselor' | 'student')

**`Notification`** (New notification types)
- `session_confirmed` - Session confirmed by counselor
- `session_cancelled` - Session cancelled
- `session_completed` - Session marked complete
- `session_rescheduled` - Session moved to new time

---

## 🔒 Security & Permissions

### Authentication Required
All Cloud Functions use `requireCounselor(request)` helper:
- ✅ Validates user is logged in
- ✅ Checks user has 'counselor' or 'career_counselor' role
- ✅ Throws `UNAUTHENTICATED` error if not authorized

### Ownership Validation
- Sessions: Verifies `session.counselorId === counselor.id`
- Notes: Only shows notes created by requesting counselor
- Assessments: Only accessible for assigned students

### Data Privacy
- Student notes are `isPrivate: true` by default
- Assessment results only visible to assigned counselor
- Session notes not visible to students

---

## 🐛 Error Handling

All Cloud Functions follow consistent error patterns:

```typescript
try {
  // Function logic
} catch (error) {
  console.error('Error description:', error);
  throw new Parse.Error(
    Parse.Error.INTERNAL_SERVER_ERROR,
    `Failed to perform action: ${error.message}`
  );
}
```

**Common Error Codes:**
- `INVALID_QUERY` - Missing/invalid parameters
- `OPERATION_FORBIDDEN` - Not authorized for resource
- `UNAUTHENTICATED` - User not logged in
- `INTERNAL_SERVER_ERROR` - Unexpected error

---

## Phase 3: Availability & Calendar Management

### Backend Cloud Functions

#### 1. `setAvailability` - Set Weekly Availability

**Purpose:** Define counselor's weekly availability schedule.

**Parameters:**
```typescript
{
  schedule: {
    [day: string]: string[]  // e.g., { monday: ['09:00-12:00', '13:00-17:00'] }
  }
}
```

**Returns:**
```typescript
{
  success: true,
  message: 'Availability schedule updated successfully'
}
```

**Usage:**
```typescript
const schedule = {
  monday: ['09:00-12:00', '13:00-17:00'],
  tuesday: ['09:00-12:00', '13:00-17:00'],
  wednesday: ['09:00-12:00'],
  thursday: ['13:00-17:00'],
  friday: ['09:00-12:00', '13:00-17:00']
};

const result = await Parse.Cloud.run('setAvailability', { schedule });
```

---

#### 2. `blockTimeSlot` - Block Specific Time

**Purpose:** Block a specific time range (vacation, meeting, etc.).

**Parameters:**
```typescript
{
  startTime: Date,     // Block start time
  endTime: Date,       // Block end time
  reason?: string      // Optional reason
}
```

**Returns:**
```typescript
{
  success: true,
  blockedSlot: {
    id: 'slot123',
    startTime: Date,
    endTime: Date,
    reason: 'Personal appointment'
  }
}
```

**Usage:**
```typescript
const result = await Parse.Cloud.run('blockTimeSlot', {
  startTime: new Date('2025-01-15T14:00:00'),
  endTime: new Date('2025-01-15T15:30:00'),
  reason: 'Doctor appointment'
});
```

---

#### 3. `getAvailableSlots` - Get Bookable Slots

**Purpose:** Get available time slots for a specific date.

**Features:**
- 30-minute slot increments
- Conflict detection (existing sessions + blocked slots)
- Configurable duration

**Parameters:**
```typescript
{
  date: Date,              // Date to check
  duration: number,        // Session duration in minutes
  counselorId?: string     // Optional (defaults to current user)
}
```

**Returns:**
```typescript
{
  availableSlots: [
    { startTime: Date, endTime: Date, duration: 60 },
    { startTime: Date, endTime: Date, duration: 60 }
  ]
}
```

**Usage:**
```typescript
// Get 60-minute slots for tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const result = await Parse.Cloud.run('getAvailableSlots', {
  date: tomorrow,
  duration: 60
});

result.availableSlots.forEach(slot => {
  console.log(`${slot.startTime} - ${slot.endTime}`);
});
```

---

#### 4. `getAvailabilitySchedule` - Get Current Schedule

**Purpose:** Retrieve counselor's current availability schedule.

**Parameters:** None

**Returns:**
```typescript
{
  hasSchedule: true,
  schedule: {
    monday: ['09:00-12:00', '13:00-17:00'],
    tuesday: ['09:00-12:00', '13:00-17:00']
  },
  updatedAt: Date
}
```

**Usage:**
```typescript
const result = await Parse.Cloud.run('getAvailabilitySchedule');

if (result.hasSchedule) {
  console.log('Current schedule:', result.schedule);
}
```

---

### Frontend Hook: `useAvailability`

**Location:** `frontend/src/hooks/counselor/useAvailability.ts`

**Methods:**

1. **`setAvailability(schedule)`** - Save weekly schedule
2. **`blockTimeSlot({ startTime, endTime, reason })`** - Block specific time
3. **`getAvailableSlots(date, duration, counselorId?)`** - Get bookable slots
4. **`getAvailabilitySchedule()`** - Get current schedule

**State:**
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

**Example Component:** `AvailabilityScheduler.tsx` (278 lines)

---

## Phase 4: Messaging & Outreach

### Backend Cloud Functions

#### 1. `sendBulkMessage` - Send to Multiple Students

**Purpose:** Send message to up to 100 students at once.

**Features:**
- Auto-creates ChatRooms if they don't exist
- Sends push notifications
- Returns success/failed arrays

**Parameters:**
```typescript
{
  studentIds: string[],    // Max 100 students
  message: string,         // Message content
  subject?: string         // Optional subject
}
```

**Returns:**
```typescript
{
  success: [
    { studentId: 'student1', chatRoomId: 'room1' },
    { studentId: 'student2', chatRoomId: 'room2' }
  ],
  failed: [
    { studentId: 'student3', error: 'Student not found' }
  ],
  summary: {
    total: 3,
    successful: 2,
    failed: 1
  }
}
```

**Usage:**
```typescript
const result = await Parse.Cloud.run('sendBulkMessage', {
  studentIds: ['student1', 'student2', 'student3'],
  message: 'Reminder: RIASEC assessment due this Friday.',
  subject: 'Assessment Reminder'
});

console.log(`Sent to ${result.summary.successful} students`);
```

---

#### 2. `createMessageTemplate` - Save Template

**Purpose:** Create reusable message template.

**Parameters:**
```typescript
{
  title: string,
  content: string,
  category?: string,        // 'general', 'reminder', 'announcement', 'followup'
  placeholders?: string[]   // ['{{studentName}}', '{{dueDate}}']
}
```

**Returns:**
```typescript
{
  success: true,
  template: {
    id: 'template123',
    title: 'Weekly Check-in',
    content: 'Hi {{studentName}}, how are you doing this week?',
    category: 'general'
  }
}
```

**Usage:**
```typescript
const result = await Parse.Cloud.run('createMessageTemplate', {
  title: 'Weekly Check-in',
  content: 'Hi {{studentName}}, how are you doing this week?',
  category: 'general',
  placeholders: ['{{studentName}}']
});
```

---

#### 3. `getMessageTemplates` - Retrieve Templates

**Purpose:** Get saved message templates (up to 50).

**Parameters:**
```typescript
{
  category?: string  // Optional filter
}
```

**Returns:**
```typescript
{
  templates: [
    {
      id: 'template1',
      title: 'Weekly Check-in',
      content: 'Hi {{studentName}}...',
      category: 'general'
    }
  ],
  count: 1
}
```

**Usage:**
```typescript
// Get all templates
const allTemplates = await Parse.Cloud.run('getMessageTemplates');

// Get reminder templates only
const reminders = await Parse.Cloud.run('getMessageTemplates', {
  category: 'reminder'
});
```

---

#### 4. `updateMessageTemplate` - Edit Template

**Purpose:** Update existing template (ownership validated).

**Parameters:**
```typescript
{
  templateId: string,
  title?: string,
  content?: string,
  category?: string
}
```

**Returns:**
```typescript
{
  success: true,
  template: { /* updated template */ }
}
```

**Usage:**
```typescript
const result = await Parse.Cloud.run('updateMessageTemplate', {
  templateId: 'template123',
  content: 'Updated message content...'
});
```

---

#### 5. `deleteMessageTemplate` - Delete Template

**Purpose:** Delete template (ownership validated).

**Parameters:**
```typescript
{
  templateId: string
}
```

**Returns:**
```typescript
{
  success: true,
  message: 'Template deleted successfully'
}
```

**Usage:**
```typescript
await Parse.Cloud.run('deleteMessageTemplate', {
  templateId: 'template123'
});
```

---

### Frontend Hook: `useMessaging`

**Location:** `frontend/src/hooks/counselor/useMessaging.ts`

**Methods:**

1. **`sendBulkMessage({ studentIds, message, subject })`** - Send to multiple students
2. **`createMessageTemplate(template)`** - Create new template
3. **`getMessageTemplates(category?)`** - Retrieve templates
4. **`updateMessageTemplate(templateId, updates)`** - Edit template
5. **`deleteMessageTemplate(templateId)`** - Delete template

**State:**
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

**Example Component:** `BulkMessaging.tsx` (398 lines)

---

## 📞 Support

**Backend Issues:** Check Parse Server logs
```bash
ssh ubuntu@3.91.52.5
pm2 logs parse-server-prod
```

**Frontend Issues:** Check browser console
```javascript
// Enable Parse SDK logging
Parse.enableLocalDatastore();
```

**Questions:** Review code examples:
- `SessionManagementExamples.tsx` (Phases 1 & 2)
- `AvailabilityScheduler.tsx` (Phase 3)
- `BulkMessaging.tsx` (Phase 4)
