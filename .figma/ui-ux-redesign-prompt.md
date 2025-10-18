# Figma AI UI/UX Redesign Prompt for Elimu Smart

## Project Overview
Elimu Smart is a career guidance platform for Kenyan students (Form 1-4, KCSE level) that helps them discover careers, match with universities, and connect with professional counselors. The platform currently has a functional React-based interface but needs a comprehensive UI/UX redesign to improve conversion rates, user engagement, and professional appeal.

---

## Current Platform Context

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **UI Library**: shadcn/ui + TailwindCSS 4.x
- **Design System**: Orange primary (#f97316), clean modern interface
- **Target Devices**: Mobile-first (70% mobile users), tablet, desktop

### User Roles & Themes
1. **Students** (Orange theme #f97316) - Primary users, ages 14-18
2. **Counselors** (Yellow theme #eab308) - Professional guidance providers
3. **Admins** (Purple theme) - Platform managers

### Core Features to Redesign
1. **Assessment System** - RIASEC personality test, Skills assessment, University finder
2. **Dashboard** - Dynamic cards showing career readiness, KUCCPS deadline, scholarships
3. **Messaging/Chat** - Student-counselor communication (currently LinkedIn-style floating widget)
4. **Guidance Services** - Q&A, Resources, Crisis support, Session booking
5. **Profile & Settings** - User account management, subscription status

---

## Design Objectives

### 1. Conversion Rate Optimization (Primary Goal)
**Current State**: 6.75% conversion from free to paid
**Target**: 19.3% conversion (+186% increase)

**Key Conversion Points to Redesign**:
- Landing page → Assessment completion
- Assessment completion → Dashboard engagement
- Free user → Premium subscription (KES 499/month)
- Dashboard visit → Counselor booking

**Psychological Triggers to Incorporate**:
- **Urgency**: KUCCPS deadline countdown (visual timer with days/hours)
- **Social Proof**: "2,347 students upgraded this month" with live counter
- **Trust Signals**: 30-day money-back guarantee, M-Pesa verified badge, counselor certifications
- **Scarcity**: "3 counselor slots left today" for session booking
- **Progress Visualization**: Career readiness score with clear improvement path

### 2. User Experience Goals

**Students (Age 14-18)**:
- **Friendly & Approachable**: Not corporate/professional, authentic student voice
- **Mobile-First**: 70% use phones, thumb-friendly navigation zones
- **Instant Gratification**: See value BEFORE asking for input (no multi-step forms)
- **Visual Hierarchy**: Use icons, colors, and space to reduce cognitive load
- **Emotional Connection**: Address real fears ("What if I choose wrong?", "My parents want me to be a doctor")

**Counselors**:
- **Efficiency-Focused**: Quick access to student roster, pending questions, today's sessions
- **Professional**: Clean dashboard with analytics, revenue tracking
- **Unified Interface**: Single tabbed view instead of multiple pages

### 3. Kenya-Specific Design Considerations

**Cultural Context**:
- **KCSE System**: Use Form 1-4 labels (not Grade 9-12)
- **KUCCPS Integration**: Prominent university placement deadline tracking
- **Local Payment**: M-Pesa primary payment method (show M-Pesa logo)
- **Subject Combinations**: STEM cluster points, career-subject matching
- **Economic Reality**: Acknowledge cost constraints, show scholarship opportunities

**Language & Tone**:
- Use Kenyan English spellings (e.g., "counsellor" not "counselor" in formal text)
- Informal student messaging: "Karibu! Let's find your path 🎯"
- Respect for authority: Parents/guardians get mentions in decision-making

---

## Specific Component Redesign Requests

### 1. Landing Page / Hero Section
**Current Issues**: Generic, doesn't communicate urgency or value

**Redesign Requirements**:
- **Hero Headline**: Address student pain point directly
  - Example: "Confused About Your Career? 96% of Students Find Clarity in 15 Minutes"
- **3-Second Rule**: User should understand value proposition in 3 seconds
- **Visual Hierarchy**:
  - Primary CTA: "Take Free RIASEC Assessment" (orange button, thumb-size)
  - Secondary CTA: "Watch How It Works" (video thumbnail)
- **Trust Badges**: Row of 4-5 icons (2000+ students, KUCCPS verified, M-Pesa, 30-day guarantee, Certified counselors)
- **Social Proof**: Rotating testimonials with student photos + Form 4 labels
- **Above Fold**: Everything critical visible without scrolling on mobile

**Inspiration**: PathwayU landing page (clean), Kuder Hero section (trustworthy)

---

### 2. Dashboard (Student View)

**Current State**: 8 dynamic cards in grid layout
**Problem**: Information overload, unclear next actions

**Redesign Requirements**:

#### **Layout Structure** (Mobile-first):
```
[Hero KPI Section]
  - Career Readiness Score: 67/100 (large circular progress bar)
  - Motivational message: "Almost there! Complete Skills Assessment to unlock personalized recommendations"
  - Visual: Gradient fill animation showing progress

[Urgent Actions Section] (Red/Orange gradient cards)
  - KUCCPS Deadline: "23 days left" (countdown with icon)
  - Pending Assessment: "Complete to unlock 47 matching careers"
  - New Scholarship: "3 new matches - deadline in 5 days"
  - Max 3 cards, swipeable on mobile

[Quick Wins Section] (Green gradient cards)
  - Latest Results: "Your RIASEC Results Ready" (CTA: View Report)
  - Next Step: "Explore 12 Matching Careers" (CTA: Browse)
  - Counselor Tip: Daily guidance tip from assigned counselor

[Progress Tracking]
  - 5 Assessments: Visual checklist with completion %
  - University Applications: Timeline view (like Trello board)
  - Career Exploration: "15/50 careers explored" progress bar
```

**Design Patterns**:
- **Bento Grid**: Variable card heights (tall for complex, compact for metrics)
- **60-30-10 Color Rule**: 60% white/neutral, 30% orange brand, 10% accent gradients
- **Gradient Icon Containers**: Modern depth (e.g., purple gradient for assessments, blue for universities)
- **Micro-interactions**: Hover animations, confetti on completion, subtle pulse for urgent items

**Inspiration**: Linear app dashboard (clean hierarchy), Notion dashboard (flexible cards)

---

### 3. Assessment Flow (RIASEC Example)

**Current State**: Single-page 96-question form
**Problem**: Long, intimidating, no progress feedback

**Redesign Requirements**:

**Landing Screen** (Before Questions):
- **Value Preview**: "Discover your Holland Code in 12 minutes"
- **What You'll Get**: 3 bullet points with icons
  - Your personality type (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
  - 12+ matching career paths with salary ranges
  - University courses that fit your strengths
- **Visual**: Circular diagram showing 6 RIASEC types with icons
- **CTA**: "Start Assessment" (large orange button)

**Question Interface**:
- **Progress Indicator**: "Question 12 of 96" + visual progress bar at top
- **Section Headers**: "Part 1: Activities You Enjoy" (every 16 questions)
- **Question Cards**:
  - One question per screen on mobile (swipe to next)
  - Likert scale: 5 emoji buttons (😞 😐 🙂 😊 😍) instead of radio buttons
  - Auto-advance after selection (no "Next" button needed)
- **Micro-breaks**: Every 24 questions, show motivational message:
  - "Great job! You're 25% done 🎉"
  - "Fun fact: Most engineers score high on Investigative"
  - Include "Take a break" and "Continue" buttons

**Results Screen**:
- **Hero**: Large circular chart showing top 3 types (e.g., 65% Social, 58% Enterprising, 42% Artistic)
- **Personality Summary**: 2-3 sentences in student-friendly language
  - "You're a natural connector! You thrive when helping others and love working in teams."
- **Career Matches**: Top 12 careers in swipeable cards
  - Job title + icon
  - Match percentage
  - Average salary in KES
  - "Learn More" CTA
- **Next Steps**:
  - "Explore Matching Universities" (button)
  - "Book Counselor to Discuss Results" (button)
  - "Share with Parents" (share icon)

**Design Inspiration**: Duolingo lesson flow (gamified progress), TypeForm (conversational UI)

---

### 4. Messaging/Chat Interface

**Current State**: LinkedIn-style floating widget with conversation list + chat view
**Problem**: Small, cramped, lacks personality

**Redesign Requirements**:

#### **Floating Chat Button**:
- **Design**: Circular orange button, bottom-right corner
- **Icon**: Chat bubble with unread count badge (red dot)
- **Micro-interaction**: Subtle pulse animation when new message arrives
- **Size**: 56px × 56px (thumb-friendly on mobile)

#### **Expanded Chat Panel** (w-96, h-[550px]):

**Header**:
- Title: "Messaging" with connection status (🟢 Online)
- Compose button: "New" with + icon (orange, rounded-full)
- Close/Minimize buttons: Always visible (current bug fixed ✅)

**Conversation List View**:
- **Filter Tabs**: All | Unread (with count badge) | Starred | Archived
  - Use icons for starred/archived to save space
- **Search Bar**: "Search messages..." with magnifying glass icon
- **Conversation Cards**:
  ```
  [Avatar] [Online Indicator]
  Name + Role Badge (👨‍🏫 Counselor / 🎯 Mentor)
  Last message preview (1 line, truncated)
  Timestamp (5m, 2h, Oct 12)
  Unread count (orange badge)
  Pin icon (hover to show, blue when pinned)
  ```
- **Pinned Conversations**: Blue background tint, sorted to top
- **Empty State**: "No conversations yet. Start connecting with counselors!" (with illustration)

**Active Conversation View**:
- **Back Button**: "← Back to messages" (orange text)
- **Search in Conversation**: Small search input for filtering messages
- **Messages Area**:
  - **Own Messages**: Orange gradient bubbles, right-aligned
  - **Received Messages**: White bubbles with border, left-aligned
  - **Timestamps**: Show every 5 minutes, centered gray text
  - **Read Receipts**: ✓ Sent, ✓✓ Delivered (orange), ✓✓ Read (blue)
  - **Message Actions**: Hover shows dropdown (React, Reply, Star, Copy, Delete)
  - **Reactions**: Display below message (👍 ❤️ 😂 count)
  - **Star Indicator**: Yellow star icon on top-right of starred messages

**Message Input**:
- **Paperclip Button**: File upload (images, PDFs, docs)
- **Emoji Picker**: Smile icon opens popover with 36 common emojis
- **Text Input**: "Write a message..." placeholder, multi-line support
- **Send Button**: Orange circular button with paper plane icon
- **File Preview**: Orange-tinted card above input showing filename + progress bar

**Design Patterns**:
- **WhatsApp-inspired bubbles**: Rounded corners, tail on one side
- **Smooth transitions**: Slide-in animations for new messages
- **Skeleton loaders**: Show placeholders while messages load
- **Infinite scroll**: Load older messages on scroll-up

**Design Inspiration**: WhatsApp Web (familiar UX), Slack (message actions), iMessage (bubble design)

---

### 5. Subscription/Pricing Page

**Current State**: Generic pricing cards
**Problem**: Low conversion (6.75%), lacks urgency and social proof

**Redesign Requirements**:

#### **Layout Structure**:

**Hero Section**:
- **Headline**: "Get Personal Guidance from Certified Counselors"
- **Subheadline**: "Join 2,347 students who upgraded this month"
- **Urgency Banner**: Red bar with "⏰ KUCCPS Deadline in 23 days - Get help now!"

**Pricing Comparison** (3-column layout on desktop, swipeable cards on mobile):

```
[FREE TIER]                  [PREMIUM - RECOMMENDED]           [PREMIUM + SESSIONS]
KES 0/month                   KES 499/month                    KES 1,999/month

✓ All Assessments             ✓ Everything in Free             ✓ Everything in Premium
✓ Career Explorer             ✓ Priority Counselor Inbox       ✓ 2 Video Sessions/month
✓ University Finder           ✓ 24hr Response Guarantee        ✓ Unlimited Chat
✓ Community Q&A               ✓ Personalized Recommendations   ✓ Resume Review
✓ Resource Library            ✓ Scholarship Alerts             ✓ University App Support
                              ✓ KUCCPS Timeline Tracker

CTA: Current Plan             CTA: Upgrade Now (orange)        CTA: Book Consultation
```

**Feature Comparison Table** (below pricing cards):
- 15-20 features with checkmarks/X marks
- Expandable sections: "Assessments", "Guidance", "Support"
- Highlight premium-only features in orange

**Trust & Social Proof Section**:
```
[Trust Badges Row]
🛡️ 30-Day Money-Back Guarantee | 👥 2,000+ Active Students | ⭐ 4.8/5 Rating | 🔒 M-Pesa Verified

[Student Testimonials] (3 cards)
"I was so confused about medicine vs. engineering. My counselor helped me realize..."
- Jane Wambui, Form 4, Nairobi
[Photo] [5 stars]

[Counselor Credentials]
"All our counselors are certified by Kenya Counseling Association"
[Row of counselor avatars with credentials badges]
```

**FAQ Section** (Expandable accordion):
- "What happens after I upgrade?"
- "Can I cancel anytime?"
- "How fast do counselors respond?"
- "Is my payment information secure?"
- "What if I'm not satisfied?"

**Sticky CTA Bar** (mobile):
- Fixed to bottom of screen
- "Upgrade to Premium - KES 499/month" button
- Shows when user scrolls past pricing cards

**Design Patterns**:
- **Eleken UX principles**: Clear value hierarchy, social proof, urgency
- **Recommended badge**: Orange "MOST POPULAR" ribbon on premium card
- **Visual pricing**: Large bold numbers, strike-through for discounts
- **Feature icons**: Small icons next to each feature (not just text)

**Design Inspiration**: Scoir pricing page (education-focused), PathwayU conversion funnel

---

### 6. Mobile Navigation

**Current State**: Standard top navbar + sidebar
**Problem**: Not optimized for one-handed mobile use

**Redesign Requirements**:

#### **Bottom Tab Bar** (Mobile only, < 768px):
```
[Home] [Assessments] [Chat] [Guidance] [Profile]
  🏠       📝           💬      🎓        👤
```

**Interaction**:
- Active tab: Orange color with filled icon
- Inactive tabs: Gray color with outline icon
- Badge counts: Red dot on Chat (unread messages), Assessments (incomplete)
- Haptic feedback: Subtle vibration on tap (if supported)

**Top Bar** (Mobile):
- Logo (left)
- Notification bell (right, with count badge)
- Search icon (right)
- Profile picture (right, opens slide-in menu)

#### **Desktop Navigation** (≥ 768px):
- **Top Navbar**: Horizontal with dropdowns
- **Sidebar**: Collapsible left sidebar for admin/counselor dashboards
- **Breadcrumbs**: Show current location path

---

### 7. Color System & Typography

**Current Colors**:
- Primary: Orange #f97316
- Student theme: Orange #f97316
- Counselor theme: Yellow #eab308
- Admin theme: Purple (exact hex TBD)

**Redesign Color Palette**:

**Primary (Student Journey)**:
```
Orange 50:  #fff7ed (backgrounds)
Orange 100: #ffedd5 (hover states)
Orange 500: #f97316 (primary buttons, CTAs)
Orange 600: #ea580c (button hover)
Orange 700: #c2410c (text, active states)
```

**Secondary (Counselor)**:
```
Yellow 100: #fef3c7 (backgrounds)
Yellow 500: #eab308 (counselor badges)
Yellow 600: #ca8a04 (hover)
```

**Semantic Colors**:
```
Success Green: #22c55e (completed states, positive metrics)
Warning Amber: #f59e0b (urgent actions, deadlines)
Error Red:     #ef4444 (errors, critical alerts)
Info Blue:     #3b82f6 (informational cards, links)
```

**Neutral Scale** (Gray):
```
Gray 50:  #f9fafb (page backgrounds)
Gray 100: #f3f4f6 (card backgrounds)
Gray 200: #e5e7eb (borders)
Gray 600: #4b5563 (body text)
Gray 900: #111827 (headings)
```

**Gradients** (for visual interest):
```
Orange Gradient:  linear-gradient(135deg, #f97316 0%, #fb923c 100%)
Purple Gradient:  linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)
Blue Gradient:    linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)
Green Gradient:   linear-gradient(135deg, #22c55e 0%, #4ade80 100%)
```

**Typography**:
- **Font Family**: Inter (headings), Inter (body) - system font for fast loading
- **Headings**:
  - H1: 36px/40px, font-weight: 700 (mobile: 28px/32px)
  - H2: 30px/36px, font-weight: 600 (mobile: 24px/28px)
  - H3: 24px/28px, font-weight: 600 (mobile: 20px/24px)
  - H4: 20px/24px, font-weight: 600 (mobile: 18px/22px)
- **Body**: 16px/24px, font-weight: 400 (mobile: 14px/20px)
- **Small**: 14px/20px, font-weight: 400 (mobile: 12px/16px)
- **Button Text**: 16px, font-weight: 600, uppercase tracking

**Icon System**:
- **Library**: Lucide React (already in use)
- **Size**: 20px default, 24px for primary actions, 16px for small UI
- **Style**: Outline icons (not filled) for consistency

---

### 8. Component Design Patterns

#### **Cards**:
- **Border Radius**: 12px (modern, friendly)
- **Shadow**:
  - Default: `0 1px 3px rgba(0,0,0,0.1)`
  - Hover: `0 8px 16px rgba(0,0,0,0.15)`
- **Padding**: 16px (mobile), 24px (desktop)
- **Max Width**: 400px for narrow cards, full width for complex content

#### **Buttons**:
**Primary Button** (Orange):
```
Background: #f97316
Hover: #ea580c
Text: White, 16px, font-weight: 600
Padding: 12px 24px
Border Radius: 8px (normal) or 9999px (rounded-full for CTAs)
Min Height: 44px (touch-friendly)
Disabled: Opacity 0.5
```

**Secondary Button** (Outline):
```
Background: Transparent
Border: 2px solid #f97316
Text: #f97316
Hover: Background #fff7ed
```

**Ghost Button** (Text only):
```
Background: Transparent
Text: #f97316
Hover: Background #f3f4f6
Padding: 8px 12px
```

**Button States**:
- Loading: Show spinner inside button, disable clicks
- Success: Brief green checkmark animation (800ms)
- Error: Shake animation (200ms)

#### **Form Inputs**:
```
Border: 1px solid #e5e7eb
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px (prevents zoom on iOS)
Focus: Border #f97316, Ring 4px #fff7ed

Labels: 14px, font-weight: 500, color #4b5563, margin-bottom: 8px
Error: Border #ef4444, Helper text red below input
Success: Border #22c55e, Checkmark icon right side
```

#### **Badges**:
```
Small Badge (Unread count):
  Background: #ef4444
  Text: White, 10px, font-weight: 600
  Padding: 2px 6px
  Border Radius: 9999px (fully rounded)

Role Badge (Counselor/Mentor):
  Background: Based on role (orange/green/purple)
  Text: White or dark based on contrast
  Padding: 4px 12px
  Font Size: 12px
  Icon: Emoji before text (👨‍🏫 Counselor)
```

#### **Progress Bars**:
```
Track: Background #e5e7eb, height 8px, border-radius 4px
Fill: Background #f97316, animated left-to-right
Percentage Text: Above bar, right-aligned, 14px, font-weight: 600
```

#### **Skeleton Loaders**:
```
Background: Linear gradient animation
  from #f3f4f6 to #e5e7eb to #f3f4f6
Duration: 1.5s infinite
Border Radius: Match component (8px for cards, 4px for text lines)
```

---

## Design Deliverables Expected from Figma AI

### 1. High-Fidelity Mockups (Desktop + Mobile)
- Landing page (above fold + full page)
- Student Dashboard
- RIASEC Assessment (landing + question + results screens)
- Chat interface (conversation list + active chat)
- Subscription/Pricing page
- Counselor Dashboard (unified tabbed view)
- Admin Dashboard (overview)

### 2. Component Library
- Design system tokens (colors, typography, spacing)
- Button variants (primary, secondary, ghost, sizes)
- Input components (text, textarea, select, checkbox, radio)
- Card components (standard, bento grid variants)
- Navigation components (top bar, bottom tabs, sidebar)
- Modal/Dialog components
- Badge/Chip components
- Progress indicators (bars, circles, spinners)

### 3. Interactive Prototypes
- Student onboarding flow (signup → assessment → results → dashboard)
- Premium upgrade flow (pricing page → payment → confirmation)
- Counselor booking flow (browse → select time → book → confirmation)
- Chat conversation (open widget → select counselor → send message)

### 4. Responsive Breakpoints
- Mobile: 375px (iPhone SE), 414px (iPhone Pro Max)
- Tablet: 768px, 1024px (iPad)
- Desktop: 1280px, 1440px, 1920px

### 5. Accessibility Annotations
- Color contrast ratios (WCAG AA minimum)
- Focus states for keyboard navigation
- Touch target sizes (minimum 44px × 44px)
- Screen reader labels for icons

---

## Inspiration & Reference Links

**Modern Education Platforms**:
- PathwayU: Clean assessment flow, trustworthy design
- Kuder: Professional guidance interface
- Scoir: Conversational student UX
- Linear: Beautiful dashboard hierarchy
- Notion: Flexible card layouts

**Conversion-Optimized Designs**:
- Eleken.co portfolio: UX case studies with conversion metrics
- Stripe: Clear pricing tables with feature comparison
- Duolingo: Gamified progress tracking

**Chat/Messaging References**:
- WhatsApp Web: Familiar bubble design
- Slack: Professional threading and reactions
- LinkedIn Messaging: 2-column layout (we already use this pattern)

---

## Technical Constraints (For Implementation)

**Must Use**:
- TailwindCSS class names (not custom CSS)
- shadcn/ui components (already in codebase)
- Lucide React icons
- Responsive design with mobile-first approach

**Avoid**:
- Heavy animations (keep performance in mind)
- Custom fonts (use system fonts: Inter, -apple-system)
- Complex illustrations (use icons + gradients)
- Too many colors (stick to defined palette)

---

## Success Metrics for Redesign

**Quantitative Goals**:
- Increase conversion rate: 6.75% → 19.3% (+186%)
- Reduce assessment drop-off: 45% → 25%
- Increase dashboard DAU: 30% → 50%
- Improve mobile engagement: +40% time on site
- Boost counselor booking: 12/week → 50/week

**Qualitative Goals**:
- Students say "This feels made for me, not adults"
- Counselors say "I can find everything in one place"
- Parents say "I trust this platform with my child's future"
- Design feels distinctly Kenyan, not generic Western

---

## Figma AI Specific Instructions

1. **Start with Mobile First**: Design 375px mobile screens before desktop
2. **Use Auto Layout**: Make all frames responsive with auto-layout properties
3. **Create Component Variants**: Buttons should have 3 states (default, hover, disabled)
4. **Color Styles**: Define all colors as styles for easy theme switching
5. **Text Styles**: Create text styles for all heading/body sizes
6. **Smart Animate**: Add micro-interactions for key user flows
7. **Annotations**: Add design notes explaining "why" behind decisions
8. **Accessibility**: Mark contrast ratios, focus states, touch targets

---

## Questions for Clarification (Optional)

If Figma AI needs more context, ask about:
- Specific user personas (e.g., "Grace, Form 3 student from Kisumu")
- Exact content for hero headlines
- Counselor profile information structure
- Assessment question types and formats
- University data fields (name, location, cluster points, cutoff)

---

## File Organization

**Figma File Structure**:
```
📁 Elimu Smart UI/UX Redesign
  📄 Cover Page (Project overview)
  📄 Design System (Colors, Typography, Components)
  📄 Landing Page (Desktop + Mobile)
  📄 Student Dashboard (Desktop + Mobile)
  📄 Assessment Flow (3 screens × 2 views)
  📄 Chat Interface (Desktop + Mobile)
  📄 Subscription Page (Desktop + Mobile)
  📄 Counselor Dashboard (Desktop)
  📄 Prototypes (Interactive flows)
  📄 Handoff Notes (Developer guidelines)
```

---

## Final Note

This redesign should make Kenyan students feel **understood, empowered, and confident** about their career choices. The design must balance **professional credibility** (parents trust it) with **youthful energy** (students love it). Every pixel should serve the goal of helping a 16-year-old Form 3 student discover their path forward.

Remember: We're not building a corporate HR tool or a generic assessment platform. We're building a **career companion** for Kenyan teenagers navigating one of the most important decisions of their lives. The design should feel like a supportive friend, not a bureaucratic system.

**Target Emotion**: "Finally, someone gets what I'm going through. This actually helps."
