# Assessment UAT - Immediate Testing Guide

## 🚀 Test the Assessment RIGHT NOW

### Step 1: Backend Connectivity Test

**Test the API endpoints:**
```bash
# 1. Make sure backend is running
cd backend
node server-working.js

# 2. Test the basic API
curl http://localhost:1337/api/test
```

**Expected Response:** `{"message": "Elimu Smart API is working!", "timestamp": "..."}`

---

### Step 2: Frontend Assessment Flow Test

**Manual walkthrough:**

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to:** `http://localhost:5173`

3. **Complete this user journey:**
   - Click "Login" 
   - Use credentials: `student@elimu.com` / `student123`
   - Navigate to Student Dashboard
   - Find "Free RIASEC Career Assessment" card
   - Click "Start Assessment"

4. **Test question flow:**
   - Verify question 1 displays properly
   - Test rating scale (click 1, 2, 3, 4, 5)
   - Try clicking "Next" without selecting (should be disabled)
   - Select a rating and click "Next"
   - Complete 5-10 questions to test flow
   - Use "Previous" button to go back and change an answer

---

### Step 3: Backend Integration Verification

**Open browser developer tools:**

1. **Go to Network tab** before starting assessment
2. **Start assessment** and watch for API calls
3. **Look for these endpoints:**
   - `POST /functions/startRiasecAssessment`
   - `POST /functions/saveRiasecResponse` (for each question)
   - `POST /functions/logUserActivity`

4. **Check response status:** All should return `200 OK`

---

### Step 4: Data Persistence Test

**Test session management:**

1. **Start assessment** and answer 10 questions
2. **Close browser tab completely**
3. **Reopen browser** and navigate back to assessment
4. **Verify:** Assessment resumes from question 11 (not question 1)

**If this works:** ✅ Backend integration is functioning
**If this fails:** ❌ Backend connection issue

---

### Step 5: Complete Assessment Test

**Full end-to-end test:**

1. **Complete all 96 questions** (or test with shorter version)
2. **Wait for results page** to load
3. **Verify results include:**
   - RIASEC scores (R, I, A, S, E, C percentages)
   - Holland Code (3-letter combination like "RIA")
   - Career matches relevant to Kenya
   - University course recommendations

4. **Check email** for completion notification

---

### Step 6: Database Verification

**Check Parse Server Dashboard:**

1. **Open:** `http://localhost:1337/dashboard`
2. **Login with:** admin credentials (check server-working.js)
3. **Navigate to Browser → RiasecAssessment**
4. **Verify:** Your assessment record exists with:
   - Correct user ID
   - Status: "completed"
   - Responses: Object with 96 entries

---

## 🎯 Quick Success Criteria

### ✅ PASS Criteria
- [ ] Assessment cards load on student dashboard
- [ ] Questions display properly with working rating scale
- [ ] Progress saves between sessions (persistence test)
- [ ] All 96 questions can be completed
- [ ] Results page loads with realistic career matches
- [ ] Database contains assessment record
- [ ] Network requests show successful API calls

### ❌ FAIL Criteria
- Assessment cards show "Coming Soon" or don't work
- Questions don't load or rating scale broken
- Progress lost when browser closed
- Assessment crashes before completion
- Results page shows errors or generic data
- No data saved in backend
- API calls return errors

---

## 🔧 Common Issues & Quick Fixes

### Issue: "Assessment cards not working"
**Solution:** Check that routes are correctly configured in `App.tsx` and assessment components exist

### Issue: "Backend connection failed"
**Solution:** 
1. Verify backend running on port 1337
2. Check CORS configuration in `server-working.js`
3. Ensure frontend points to correct API URL

### Issue: "Questions don't save progress"
**Solution:**
1. Check Parse Server is connected to database
2. Verify user is properly authenticated
3. Check Cloud Functions are loaded in main.js

### Issue: "Results calculation fails"
**Solution:**
1. Check `completeRiasecAssessment` Cloud Function
2. Verify RIASEC algorithm implementation
3. Test fallback local calculation

---

## 📊 UAT Sign-off Checklist

**Business Stakeholder Testing:**
- [ ] Assessment provides relevant career guidance for Kenyan students
- [ ] Results encourage further platform engagement
- [ ] User experience feels professional and trustworthy
- [ ] Assessment time is reasonable (15-20 minutes)

**Technical Testing:**
- [ ] All API endpoints respond correctly
- [ ] Data persistence works across sessions
- [ ] Results calculation is mathematically accurate
- [ ] Performance is acceptable on target devices

**User Experience Testing:**
- [ ] Assessment is easy to understand and complete
- [ ] Progress indicators provide clear feedback
- [ ] Error states are handled gracefully
- [ ] Results are actionable and encouraging

---

## 🚨 Critical Acceptance Gates

**GATE 1:** Assessment Starts Successfully
- User can navigate from dashboard to assessment
- First question loads without errors
- Rating scale is functional

**GATE 2:** Data Persistence Works
- Answers are saved after each question
- Session can be resumed after browser closure
- Backend database contains user responses

**GATE 3:** Assessment Completes Successfully  
- All 96 questions can be answered
- Results page loads with calculated scores
- Career matches are relevant and encouraging

**GATE 4:** Backend Integration Complete
- All API calls succeed
- Database records are created properly
- Email notifications are sent

**Only proceed to production if ALL GATES PASS ✅**

---

## 📞 Support During Testing

**If you encounter issues:**
1. Check browser developer console for errors
2. Verify backend logs for error messages
3. Test with different browsers/devices
4. Document specific steps that cause failures

**This testing approach ensures your assessment system works reliably before users access it!**