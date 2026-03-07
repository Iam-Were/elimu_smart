# Development Standards - Elimu Smart

Referenced from CLAUDE.md → "Critical Development Standards"

## 1. Code Quality (100% Compliance REQUIRED)

```bash
# MANDATORY before ANY commit:
npm run build    # Must pass with ZERO errors
npm run lint     # Must pass with ZERO errors and warnings

# Browser testing REQUIRED:
- Open DevTools console
- Check for runtime errors
- Test navigation flows
- Verify all interactive elements work
```

## 2. Component Development Rules

**ALWAYS:**
- Check CLAUDE.md FIRST before making any changes
- Use shadcn UI for all new components
- Use lowercase imports: `@/components/ui/button`
- Define proper TypeScript interfaces (NEVER use `any`)
- Include accessibility (WCAG 2.1 AA compliance)
- Test on mobile AND desktop
- Prefer editing existing files over creating new ones

**NEVER:**
- Create new files unless absolutely necessary
- Use Mantine components for new development
- Use `any` types (use `unknown` with type guards instead)
- Mix uppercase/lowercase in shadcn imports
- Create documentation files unless explicitly requested
- Use blocking API calls in user interactions
- Use `Button asChild` + `Link` + `onClick` combination

## 5. UX Design Philosophy

**Single-Page > Multi-Step (ALWAYS try single-page first)**

✅ **PREFER**: Immediate results without loading screens
- Click subject → instant career display (like SubjectCareerMapper)
- Static data for immediate value + backend for advanced features
- Everything visible on one page with progressive enhancement

❌ **AVOID**: Multi-step flows unless absolutely necessary
- Only use when: complex data collection, legal compliance, or mobile space constraints

**Key Principle**: Provide immediate value BEFORE asking for user input.

## 6. Card Content & Icon System Standards (2025 Best Practices)

**Minimal Card Content (REQUIRED)**
- **Maximum 6 Elements Per Card**: Icon, Title, Badge, Description, Benefit/Metric, CTA
- **Text Length**: Under 100 characters for descriptions
- **No Verbose Sections**: Remove "Common Questions", "What You'll Do", bullet point lists
- **Benefits**: Single plain text line (no boxes/containers)
- **Cognitive Load**: 4-6 scannable elements only

**Gradient Icon Containers (REQUIRED)**
```typescript
// ✅ CORRECT: Professional gradient icon system
<div className={cn(
  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
  `bg-gradient-to-br ${card.iconGradient}`
)}>
  {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
</div>

// ❌ NEVER: Flat backgrounds (outdated pattern)
<div className="p-2 rounded-lg bg-orange-100 text-orange-600">
  {card.icon}
</div>
```

**Card Type Color Mapping**
- **Assessment/Discovery**: Purple gradient (`from-purple-500 to-purple-600`)
- **Subject/Academic**: Blue gradient (`from-blue-500 to-blue-600`)
- **Skills/Development**: Green gradient (`from-green-500 to-green-600`)
- **University/Placement**: Indigo gradient (`from-indigo-500 to-indigo-600`)
- **Career/Exploration**: Amber gradient (`from-amber-500 to-amber-600`)
- **Results/Dashboard**: Orange gradient (`from-orange-500 to-orange-600`)

**60-30-10 Color Rule**
- **60% Base**: White/neutral backgrounds
- **30% Theme**: Primary user journey color (orange for students)
- **10% Accent**: Card type specific gradients

**Bento Grid Layout Standards**
- **Tall Cards** (`row-span-2`): High complexity content (detailed results, multi-step processes)
- **Standard Cards** (`row-span-1`): Medium complexity (balanced info + action)
- **Compact Cards** (`row-span-1`): Low complexity (metrics, quick actions)
- **Grid Definition**: `auto-rows-[minmax(280px,auto)]` for flexible heights

**Icon Best Practices**
- **Professional Platforms**: Use icons (NOT emojis)
- **Size Hierarchy**: Larger icons (w-12 h-12) for primary actions, smaller (w-6 h-6) for secondary
- **Hover Effects**: Scale transform on hover (`group-hover:scale-110`)
- **Shadow Depth**: `shadow-lg` for gradient containers
