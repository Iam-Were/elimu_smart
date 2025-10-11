# Project Tracking System

## Purpose
This tracking system prevents context loss and ensures accurate recommendations across sessions.

## Files

### 1. `project-status.json` (Single Source of Truth)
**MUST READ at start of EVERY session**

Contains:
- ✅ Completed phases and their dates
- 🔄 Component migration status (hardcoded → backend API)
- 📊 Current database counts
- 🎯 Next verified recommendations
- 📈 Mobile readiness percentage

**Usage:**
```bash
# At session start
cat .claude/project-status.json

# Before making recommendations
# CHECK: Has this already been completed?
# VERIFY: Is the component actually using hardcoded data?
```

### 2. `integration-status.json` (Backend Function Mapping)
**READ when planning backend integration work**

Contains:
- Complete list of 111 cloud functions
- Integration status (integrated/available/low-priority)
- File locations for each function
- Frontend usage locations

### 3. `mobile-readiness.md` (Mobile Dev Checklist)
**READ when assessing mobile readiness**

Contains:
- Component-by-component readiness table
- Offline support status
- Bundle size impacts
- Blockers and recommendations

## Workflow

### At Session Start
1. Read `project-status.json` for latest state
2. Check `lastUpdated` to see how recent info is
3. Review `nextRecommendations` for verified tasks

### Before Making Recommendations
1. ✅ Check `components` section - is it already migrated?
2. ✅ Verify by reading actual component file
3. ✅ Update `project-status.json` if status is wrong
4. ✅ Mark recommendation as `verified: true` after file check

### After Completing Work
1. Update `project-status.json` with:
   - New completed phase
   - Updated component status
   - New database counts (if applicable)
   - Remove completed task from `nextRecommendations`
   - Update `lastUpdated` timestamp
2. Commit changes to git with status file

### When Discovering Incorrect Information
1. Update `project-status.json` immediately
2. Add `notes` field to explain what was corrected
3. Commit correction

## Anti-Patterns (What NOT to Do)

❌ **DON'T:** Make recommendations without reading status files
❌ **DON'T:** Assume components use hardcoded data without verification
❌ **DON'T:** Forget to update status file after completing work
❌ **DON'T:** Skip reading component files before recommending migration

✅ **DO:** Always verify before recommending
✅ **DO:** Update status immediately after completion
✅ **DO:** Mark recommendations as verified/unverified
✅ **DO:** Add detailed notes when correcting information

## Example Workflow

```bash
# Session starts
user: "What's next?"

# Step 1: Read status
cat .claude/project-status.json

# Step 2: Check recommendations
# See: "Admin Dashboard Live Data - verified: true"

# Step 3: Verify the recommendation
cat frontend/src/components/cards/AdminContentManagementCards.tsx | grep "itemCount:"

# Step 4: Confirmed hardcoded values - recommendation is valid
# Proceed with task

# Step 5: After completion - update status
# Edit project-status.json:
# - Move task from nextRecommendations to completed phases
# - Update component status
# - Update lastUpdated timestamp

# Step 6: Commit
git add .claude/project-status.json
git commit -m "Update project status: Admin live data complete"
```

## Token Optimization

These tracking files save tokens:
- `project-status.json`: ~2K tokens vs reading entire CLAUDE.md (38K tokens)
- `integration-status.json`: ~2K tokens vs scanning all cloud function files
- `mobile-readiness.md`: ~800 tokens vs re-analyzing all components

**Total savings: ~34K tokens per session = More room for actual work**

## MCP Integration (Future)

When MCP server is available:
- Store project-status.json in MCP database
- Query status via MCP tools instead of file reads
- Auto-update on git commits
- Track metrics over time

Potential MCP servers:
- `@modelcontextprotocol/server-filesystem` - File-based tracking (current approach)
- `@modelcontextprotocol/server-sqlite` - Database tracking (future)
- Custom MCP server for project metrics

## Maintenance

**Weekly:** Review and update recommendations
**After Major Milestone:** Update mobile readiness %
**Monthly:** Archive old completed phases to separate file
