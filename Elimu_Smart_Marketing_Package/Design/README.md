# Elimu Smart Design Assets

This directory contains SVG graphics and visual design assets for the Elimu Smart platform, following the "Digital Commons" design philosophy.

## Design Philosophy

**"Digital Commons"** - Our visual language uses architectural forms to represent shared educational spaces. Clean geometry, educational material textures, and wayfinding-style typography create a professional yet approachable student community.

See `peer_room_philosophy.md` for complete design principles.

## Brand Colors

- **Orange Primary**: `#ea580c` to `#c2410c` (student theme, community warmth)
- **Blue Secondary**: `#2563eb` to `#1d4ed8` (trust, expertise, institutional)
- **Purple Accent**: `#7e22ce` to `#6b21a8` (discovery, assessment)
- **Green Accent**: `#15803d` to `#166534` (growth, skills)
- **Indigo Accent**: `#4f46e5` to `#4338ca` (university, academic)
- **Amber Accent**: `#f59e0b` to `#d97706` (career, exploration)
- **Slate Neutral**: `#475569` (typography, institutional text)
- **Background**: `#faf9f5` (warm off-white)

## Graphics Inventory

### 1. Peer Room Logo
**File**: `peer_room_logo.svg`
**Dimensions**: 400x400px
**Use Case**: Branding for Community Q&A feature (Peer Room)

**Design Elements**:
- Pentagon formation of 5 circles (peer network metaphor)
- Central orange circle (shared room space)
- Subtle connection lines (knowledge flow)
- Upvote icon (Reddit-inspired mechanics)
- Typography: "PEER ROOM" in Arial Bold 24px

**Integration**:
```tsx
import PeerRoomLogo from '@/assets/design/peer_room_logo.svg';

<img src={PeerRoomLogo} alt="Peer Room" className="w-16 h-16" />
```

---

### 2. RIASEC Assessment Graphic
**File**: `riasec_graphic.svg`
**Dimensions**: 800x600px
**Use Case**: Visual for RIASEC Career Assessment card on student dashboard

**Design Elements**:
- Hexagon model representing 6 Holland Codes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
- Compass icon at center (navigation/discovery metaphor)
- Inner connection lines showing personality relationships
- Metrics: "96 QUESTIONS · 15 MINUTES · 6 PERSONALITY TYPES"

**Color**: Purple gradient (`from-purple-500 to-purple-600`)

**Integration**:
```tsx
// Assessment card background or preview image
<img src={RiasecGraphic} alt="RIASEC Assessment" className="w-full h-auto" />
```

---

### 3. Skills Assessment Graphic
**File**: `skills_graphic.svg`
**Dimensions**: 800x600px
**Use Case**: Visual for Skills Assessment card

**Design Elements**:
- Radar chart with 6 axes (Communication, Problem Solving, Leadership, Teamwork, Creativity, Technical)
- Filled hexagon showing example skill profile
- Concentric circles for skill level measurement
- Metrics: "36 QUESTIONS · 10 MINUTES · 6 SKILL AREAS"

**Color**: Green gradient (`from-green-500 to-green-600`)

**Integration**:
```tsx
// Skills assessment card
<img src={SkillsGraphic} alt="Skills Assessment" className="rounded-lg" />
```

---

### 4. University Course Finder Graphic
**File**: `university_finder_graphic.svg`
**Dimensions**: 800x600px
**Use Case**: Visual for University Course Finder card

**Design Elements**:
- Simplified university buildings (3 variations)
- Student icons with pathways flowing to universities
- Central checkmark icon (matching/placement metaphor)
- Architectural window details
- Metrics: "45+ UNIVERSITIES · KUCCPS INTEGRATED · INSTANT MATCHING"

**Color**: Indigo gradient (`from-indigo-500 to-indigo-600`)

**Integration**:
```tsx
// University finder card
<img src={UniversityGraphic} alt="University Finder" className="w-full" />
```

---

### 5. Career Explorer Graphic
**File**: `career_explorer_graphic.svg`
**Dimensions**: 800x600px
**Use Case**: Visual for Career Exploration card

**Design Elements**:
- Network visualization with central "YOU" hub
- 6 career sector clusters (Health, Tech, Business, Law, Arts, Engineer)
- 12 sub-career nodes (smaller circles)
- Connection lines showing career pathways
- Metrics: "200+ CAREERS · KENYA-SPECIFIC · REAL SALARY DATA"

**Color**: Amber gradient (`from-amber-500 to-amber-600`)

**Integration**:
```tsx
// Career explorer card
<img src={CareerGraphic} alt="Career Explorer" className="object-cover" />
```

---

### 6. Subject-Career Mapper Graphic
**File**: `subject_mapper_graphic.svg`
**Dimensions**: 800x600px
**Use Case**: Visual for Subject-Career Mapper card (KCSE subject combinations)

**Design Elements**:
- Flow diagram (Sankey-style) showing KCSE subjects → careers
- Left side: 5 subject boxes (Mathematics, Physics, Chemistry, Biology, Computer)
- Right side: 4 career outcomes (Engineer, Doctor, IT Professional, Researcher)
- Central algorithm icon (matching processor)
- Curved connection paths showing subject-career relationships
- Metrics: "8 SUBJECTS · 100+ COMBINATIONS · INSTANT MATCHING"

**Color**: Blue gradient (`from-blue-500 to-blue-600`)

**Integration**:
```tsx
// Subject mapper card
<img src={SubjectMapperGraphic} alt="Subject Mapper" className="rounded-xl" />
```

---

## File Organization

```
Elimu_Smart_Marketing_Package/
├── Design/
│   ├── README.md (this file)
│   ├── peer_room_philosophy.md
│   ├── peer_room_logo.svg
│   ├── riasec_graphic.svg
│   ├── skills_graphic.svg
│   ├── university_finder_graphic.svg
│   ├── career_explorer_graphic.svg
│   └── subject_mapper_graphic.svg
├── Documents/
│   ├── QA_FORUM_BRANDING_GUIDE.md
│   ├── ELIMU_SMART_BRANDING_WHITEPAPER.md
│   └── ...
└── Screenshots/
    └── ...
```

## Technical Specifications

**Format**: SVG (Scalable Vector Graphics)
**Namespace**: `http://www.w3.org/2000/svg`
**Font Stack**: `Arial, sans-serif`
**Export**: Web-optimized SVG (no embedded fonts, clean paths)

**Advantages**:
- ✅ Infinite scalability (responsive design)
- ✅ Small file sizes (2-5KB each)
- ✅ CSS-modifiable colors/styles
- ✅ Accessible (screen readers can parse SVG text)
- ✅ Animation-ready (CSS/JS animations possible)

## Usage Guidelines

### Dashboard Card Integration

Each assessment card should use its corresponding graphic as a visual preview:

```tsx
// Example: Assessment card with graphic
<Card className="row-span-2">
  <CardHeader>
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
        <Compass className="w-6 h-6 text-white" />
      </div>
      <div>
        <CardTitle>RIASEC Career Assessment</CardTitle>
        <CardDescription>Discover your career personality type</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <img
      src="/design/riasec_graphic.svg"
      alt="RIASEC Assessment Preview"
      className="w-full h-auto rounded-lg mb-4"
    />
    <Button onClick={() => navigate('/assessment/riasec')}>
      Start Assessment
    </Button>
  </CardContent>
</Card>
```

### Peer Room Branding

Use the Peer Room logo in navigation, headers, and community features:

```tsx
// Header with logo
<div className="flex items-center gap-3 mb-6">
  <img
    src="/design/peer_room_logo.svg"
    alt="Peer Room"
    className="w-12 h-12"
  />
  <div>
    <h2 className="text-2xl font-semibold">Peer Room</h2>
    <p className="text-muted-foreground">
      Elimu Smart's Student Community - Ask, Learn, Support Each Other
    </p>
  </div>
</div>
```

### Color Consistency

Match SVG graphics with corresponding card icon gradients:

- **RIASEC** → Purple gradient (`from-purple-500 to-purple-600`)
- **Skills** → Green gradient (`from-green-500 to-green-600`)
- **University** → Indigo gradient (`from-indigo-500 to-indigo-600`)
- **Career** → Amber gradient (`from-amber-500 to-amber-600`)
- **Subject Mapper** → Blue gradient (`from-blue-500 to-blue-600`)
- **Peer Room** → Orange gradient (`from-orange-500 to-orange-600`)

## Design System Integration

These graphics follow Elimu Smart's "60-30-10 Color Rule":
- **60% Base**: White/neutral backgrounds (`#faf9f5`)
- **30% Theme**: Primary user journey color (orange for students)
- **10% Accent**: Card-type-specific gradients (purple/green/indigo/amber/blue)

All graphics use professional gradient icon containers (no flat backgrounds) per 2025 design standards documented in `CLAUDE.md`.

## Maintenance

**Last Updated**: 2025-11-29
**Designer**: Claude Code
**Platform**: Elimu Smart Career Guidance
**Status**: Production Ready ✅

For design updates or new graphics requests, follow the "Digital Commons" philosophy outlined in `peer_room_philosophy.md`.
