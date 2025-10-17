# Backend Integration Testing Checklist

**Sprint 1 Task 3: Chat Preferences Backend Sync**
**Created:** 2025-10-17
**Status:** ✅ Deployed to VPS, Ready for Testing

---

## Pre-Test Verification ✅

- [x] Backend cloud functions deployed to VPS (`chatPreferencesFunctions.js`)
- [x] Functions imported in `main.js` (line 28)
- [x] Parse Server restarted successfully (PID: 982634)
- [x] Frontend built and deployed to nginx
- [x] Health check: https://elimu-smart.co.ke/parse/health → `{"status":"ok"}`

---

## Test Suite 1: Backend Cloud Functions

### Test 1.1: Toggle Pin Conversation ✅

**Purpose:** Verify pinning a conversation creates database record

**Steps:**
1. Login to https://elimu-smart.co.ke as `student@elimu.com` / `student`
2. Navigate to `/messages` or `/inbox` route (if available)
3. Click pin icon on a conversation
4. Observe toast notification: "Conversation pinned"
5. Verify database on VPS:
   ```bash
   ssh root@145.239.42.121
   psql -U elimu -d elimu_smart_production -c \
     "SELECT userId, conversationId, type, \"createdAt\" FROM \"ConversationPreference\" ORDER BY \"createdAt\" DESC LIMIT 5;"
   ```

**Expected Result:**
- Toast shows "Conversation pinned"
- Database shows new row with:
  - `userId` = student user's objectId
  - `conversationId` = conversation's objectId
  - `type` = 'pin'
  - `createdAt` = current timestamp

**Rollback Test:**
6. Click pin icon again (unpin)
7. Observe toast: "Conversation unpinned"
8. Verify database row deleted

---

### Test 1.2: Toggle Star Message ✅

**Purpose:** Verify starring a message creates database record

**Steps:**
1. Open a conversation with messages
2. Right-click or long-press a message
3. Click "Star" option
4. Observe toast: "Message starred"
5. Verify database:
   ```bash
   psql -U elimu -d elimu_smart_production -c \
     "SELECT userId, messageId, conversationId, type FROM \"MessagePreference\" WHERE type='star' LIMIT 5;"
   ```

**Expected Result:**
- Database shows new row with `type='star'`
- Message shows star icon/indicator

---

### Test 1.3: Toggle Emoji Reaction ✅

**Purpose:** Verify adding emoji reaction creates database record

**Steps:**
1. Open a conversation
2. Click emoji button on a message
3. Select emoji (e.g., 👍)
4. Observe reaction count updates
5. Verify database:
   ```bash
   psql -U elimu -d elimu_smart_production -c \
     "SELECT userId, messageId, emoji, type FROM \"MessagePreference\" WHERE type='reaction' LIMIT 5;"
   ```

**Expected Result:**
- Database shows row with `type='reaction'` and `emoji='👍'`
- UI shows emoji with count (e.g., "👍 1")
- Other users can see the reaction (public read ACL)

---

### Test 1.4: Bulk Load Preferences ✅

**Purpose:** Verify getUserChatPreferences loads all data efficiently

**Steps:**
1. Pin 2-3 conversations
2. Star 3-4 messages
3. Add reactions to 2-3 messages
4. Refresh browser (clear React state)
5. Navigate back to `/messages`
6. Observe: All pins/stars/reactions restored from backend

**Expected Result:**
- Network tab shows single API call to `getUserChatPreferences`
- All preferences load in <500ms
- UI shows pinned conversations at top
- Starred messages show star icon
- Reactions display with correct counts

---

## Test Suite 2: Cross-Device Syncing

### Test 2.1: Pin Sync Across Browsers ✅

**Purpose:** Verify pins sync across devices

**Steps:**
1. **Browser A (Chrome):**
   - Login as `student@elimu.com`
   - Navigate to `/messages`
   - Pin conversation "Career Guidance Chat"

2. **Browser B (Firefox):**
   - Login as `student@elimu.com` (same account)
   - Navigate to `/messages`
   - Observe conversation list

**Expected Result:**
- Browser B shows "Career Guidance Chat" pinned at top
- No manual refresh needed (loads from backend on mount)

---

### Test 2.2: Star Sync Across Devices ✅

**Steps:**
1. **Device A:** Star message "Thanks for the help!"
2. **Device B:** Refresh and open same conversation
3. Verify starred message shows star icon

**Expected Result:**
- Star visible on both devices
- Backend query returns same starred message ID

---

### Test 2.3: Reaction Sync Across Users ✅

**Purpose:** Verify reactions from different users aggregate correctly

**Steps:**
1. **User A (student@elimu.com):** Add 👍 to message
2. **User B (counselor@elimu.com):** Add 👍 to same message
3. Both users refresh

**Expected Result:**
- Both see "👍 2" (count aggregated)
- Backend has 2 rows in MessagePreference (one per user)

---

## Test Suite 3: Migration & Fallback

### Test 3.1: localStorage → Backend Migration ✅

**Purpose:** Verify existing localStorage data migrates to backend

**Setup:**
```javascript
// In browser console BEFORE logging in:
localStorage.setItem('elimu_smart_pinned_conversations', JSON.stringify(['conv1', 'conv2']));
localStorage.setItem('elimu_smart_starred_messages', JSON.stringify({
  'conv1': ['msg1', 'msg2']
}));
```

**Steps:**
1. Login as `student@elimu.com`
2. Navigate to `/messages`
3. Open browser console
4. Observe logs: "🔄 Migrating localStorage preferences to backend..."
5. Wait for: "✅ Migration complete: X items migrated"
6. Verify database has migrated data
7. Check localStorage: Old keys should be deleted

**Expected Result:**
- Console shows migration logs
- Database has 2 ConversationPreference rows (conv1, conv2)
- Database has 2 MessagePreference rows (msg1, msg2)
- localStorage keys cleared: `elimu_smart_pinned_conversations`, `elimu_smart_starred_messages`
- Migration flag set: `elimu_smart_preferences_migrated = 'true'`

---

### Test 3.2: Backend Offline Fallback ✅

**Purpose:** Verify localStorage fallback when backend unavailable

**Steps:**
1. Stop Parse Server: `ssh root@145.239.42.121 "pm2 stop parse-server-prod"`
2. In browser: Try to pin a conversation
3. Observe error handling
4. Restart Parse Server: `pm2 start parse-server-prod`

**Expected Result:**
- Toast shows "Failed to update pin status"
- UI reverts to previous state (optimistic rollback)
- No crash or broken UI
- After server restart, retry succeeds

---

## Test Suite 4: Security & Permissions

### Test 4.1: ACL Isolation ✅

**Purpose:** Verify users can only see their own preferences

**Steps:**
1. **User A:** Pin conversation "Career Chat"
2. **User B:** Query database directly (admin access):
   ```bash
   psql -U elimu -d elimu_smart_production -c \
     "SELECT userId, conversationId FROM \"ConversationPreference\" WHERE conversationId='Career Chat ID';"
   ```

**Expected Result:**
- Only User A's pin appears in database
- User B's UI doesn't show User A's pin (ACL blocks read access)

---

### Test 4.2: Reaction Public Read ✅

**Purpose:** Verify reactions have public read ACL

**Steps:**
1. **User A:** Add 👍 to message
2. **User B:** View same message

**Expected Result:**
- User B sees User A's reaction
- User B can see count "👍 1"
- User B CANNOT delete User A's reaction (write-protected)

---

## Test Suite 5: Database Verification

### Test 5.1: Verify Parse Classes Created ✅

**Purpose:** Confirm database schema auto-created

**Steps:**
```bash
ssh root@145.239.42.121
psql -U elimu -d elimu_smart_production

# List all tables
\dt

# Check ConversationPreference schema
\d "ConversationPreference"

# Check MessagePreference schema
\d "MessagePreference"
```

**Expected Tables:**
- `ConversationPreference` with columns: objectId, userId, conversationId, type, ACL, createdAt, updatedAt
- `MessagePreference` with columns: objectId, userId, messageId, type, emoji, conversationId, ACL, createdAt, updatedAt

---

### Test 5.2: Query Sample Data ✅

**Steps:**
```sql
-- Get all pinned conversations
SELECT u.username, cp.conversationId, cp."createdAt"
FROM "ConversationPreference" cp
JOIN "_User" u ON u."objectId" = cp.userId
WHERE cp.type = 'pin'
ORDER BY cp."createdAt" DESC;

-- Get all starred messages
SELECT u.username, mp.messageId, mp.conversationId
FROM "MessagePreference" mp
JOIN "_User" u ON u."objectId" = mp.userId
WHERE mp.type = 'star';

-- Get reaction counts by emoji
SELECT emoji, COUNT(*) as count
FROM "MessagePreference"
WHERE type = 'reaction'
GROUP BY emoji;
```

**Expected Result:**
- Queries return user-friendly data
- Timestamps in UTC
- No orphaned records (all userId references valid)

---

## Test Suite 6: Performance

### Test 6.1: Bulk Load Performance ✅

**Purpose:** Verify preferences load quickly

**Setup:**
- Create 10 pinned conversations
- Star 20 messages
- Add 30 reactions

**Steps:**
1. Clear browser cache
2. Login and navigate to `/messages`
3. Open DevTools → Network tab
4. Observe `getUserChatPreferences` API call

**Expected Result:**
- Single API call (no N+1 queries)
- Response time <500ms
- Response size <50KB
- All 60 items loaded in one request

---

### Test 6.2: Optimistic UI Speed ✅

**Purpose:** Verify UI responds instantly

**Steps:**
1. Navigate to `/messages`
2. Click pin icon
3. Measure time to visual feedback

**Expected Result:**
- UI updates in <50ms (optimistic update)
- Backend sync happens in background
- Toast appears after backend confirms (~200-500ms)
- No UI lag or frozen state

---

## Troubleshooting Commands

### Check Parse Server Logs
```bash
ssh root@145.239.42.121
pm2 logs parse-server-prod --lines 100
pm2 logs parse-server-prod --lines 100 | grep -i error
```

### Check Database Connections
```bash
psql -U elimu -d elimu_smart_production -c "SELECT COUNT(*) FROM \"ConversationPreference\";"
psql -U elimu -d elimu_smart_production -c "SELECT COUNT(*) FROM \"MessagePreference\";"
```

### Restart Parse Server
```bash
ssh root@145.239.42.121
pm2 restart parse-server-prod
pm2 status
```

### Check Cloud Functions Loaded
```bash
# Check if chatPreferencesFunctions imported
grep -n "chatPreferencesFunctions" /root/elimu_smart/backend/cloud/main.js
```

### Clear Database (CAUTION: Production)
```sql
-- ONLY for testing - clears all preferences
DELETE FROM "ConversationPreference";
DELETE FROM "MessagePreference";
```

---

## Known Issues & Limitations

1. **UnifiedInbox Route Not in Navigation**
   - Integration complete, but no menu link to `/messages`
   - Direct URL navigation works: https://elimu-smart.co.ke/messages

2. **Reaction UI Not Fully Implemented**
   - Backend functions ready: `getMessageReactions`, `getBulkMessageReactions`
   - UI components not yet using these (emoji picker needed)

3. **Migration Runs Only Once**
   - Flag: `elimu_smart_preferences_migrated`
   - To re-test migration: Clear flag in localStorage

---

## Success Criteria

**✅ Integration Complete When:**
- [ ] All 8 cloud functions working
- [ ] Database tables created with correct schema
- [ ] Pin/star/reaction actions persist to database
- [ ] Cross-device syncing verified (2+ browsers)
- [ ] Migration from localStorage successful
- [ ] Error handling works (offline fallback)
- [ ] ACL security verified (user isolation)
- [ ] Performance <500ms for bulk load

---

## Next Steps After Testing

1. **Create menu navigation to UnifiedInbox**
   - Add route to student dashboard
   - Add "Messages" link to navigation menu

2. **Implement reaction UI components**
   - Emoji picker component
   - Reaction display with user tooltips
   - Use `getMessageReactions()` and `getBulkMessageReactions()`

3. **Monitor production metrics**
   - Database query performance
   - API response times
   - Error rates in Parse Server logs

4. **Optional: Admin moderation dashboard**
   - View all conversations (Sprint 1 Task 4)
   - Flag inappropriate content
   - Export conversation logs

---

**Last Updated:** 2025-10-17
**VPS Status:** ✅ Deployed and running
**Parse Server:** https://elimu-smart.co.ke/parse
**Frontend:** https://elimu-smart.co.ke
