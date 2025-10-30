# Subject-Career Mapper - Manual Testing Guide

## Purpose
Verify that subject switching works correctly for real users (automated testing gives false negatives because it bypasses React's synthetic event system).

## Test Steps

### 1. Navigate to the Tool
- URL: https://elimu-smart.co.ke/assessment/subjects
- Wait for page to load completely

### 2. Open Browser Console (F12)
- You should see these console logs on page load:
  ```
  🔍 useEffect fired! Selected subject: Mathematics
  📡 Fetching careers for subject: Mathematics
  ✅ Parse SDK ready, calling getCareersBySubject
  ✅ Received careers: 5
  ```

### 3. Test Subject Switching
**Click on each subject card and verify:**

#### Test Physics:
- Click the "Physics ⚛️" card
- **Expected console logs:**
  ```
  🖱️ Subject card clicked: Physics
  ✅ setState called for: Physics
  🔍 useEffect fired! Selected subject: Physics
  📡 Fetching careers for subject: Physics
  ✅ Parse SDK ready, calling getCareersBySubject
  ✅ Received careers: X
  ```
- **Expected UI changes:**
  - Physics card gets orange ring border (ring-2 ring-orange-500)
  - Mathematics card loses orange ring
  - Career list updates to show Physics-related careers
  - Loading spinner appears briefly

#### Test Chemistry:
- Click the "Chemistry 🧪" card
- **Expected:** Same pattern as Physics
- **Look for:** Mechanical Engineer, Chemical Engineer, Petroleum Engineer, etc.

#### Test Biology:
- Click the "Biology 🧬" card
- **Expected:** Careers like Doctor, Nurse, Pharmacist, Veterinarian, etc.

#### Test English:
- Click the "English 📝" card
- **Expected:** Careers like Journalist, Lawyer, Teacher, Content Writer, etc.

### 4. Check for Issues

#### ❌ If clicking does nothing:
- **Symptom:** No console logs appear, no UI changes
- **Possible causes:**
  1. JavaScript error blocking event handlers
  2. CSS z-index issue covering clickable area
  3. React hydration mismatch

#### ⚠️ If console logs appear but UI doesn't update:
- **Symptom:** Console shows "Subject card clicked" but careers don't change
- **Possible causes:**
  1. Backend Cloud Function `getCareersBySubject` failing
  2. Parse SDK not initialized
  3. Network error

#### ⚠️ If careers load but show same results:
- **Symptom:** Different subjects show identical careers
- **Possible cause:** Backend database has duplicate data or incorrect subject mapping

## Success Criteria

✅ **PASS:** 
- Clicking each subject card shows console logs
- Orange ring moves to clicked card
- Career list updates with subject-specific careers
- Loading spinner appears during fetch
- Different subjects show different careers

❌ **FAIL:**
- No console logs when clicking
- UI doesn't respond to clicks
- All subjects show the same careers
- Error messages appear in console

## Current Status

Based on code review:
- ✅ onClick handler is present (lines 492-496)
- ✅ Console logging is enabled for debugging
- ✅ useEffect properly depends on selectedSubject
- ✅ Parse SDK properly awaited with getParse()
- ✅ State management looks correct

**Hypothesis:** Feature likely works correctly for real users, but automated JavaScript clicks don't trigger React events.

**Action Required:** Manual testing by actual clicking with mouse cursor.

## If Test Passes

If manual testing confirms it works:
1. Remove console.log statements (cleanup)
2. Update todo list to mark as completed
3. Move on to fixing other issues (Learn More, Plan Path buttons)

## If Test Fails

If manual testing shows it doesn't work:
1. Note the exact symptom (console logs, UI behavior)
2. Check browser Network tab for failed API calls
3. Check for JavaScript errors in Console
4. Share findings for targeted debugging

---

**Test this now and let me know the results!**
