# Mobile App Integrations & Accounts Required

**Last Updated**: 2025-10-12
**Project**: Elimu Smart Mobile Conversion
**Purpose**: Complete checklist of all accounts, credentials, and integrations needed

---

## ✅ Immediate Setup (Do These First)

### 1. Expo Account (FREE)

**What It's For**: Development environment, testing on phone, cloud builds
**Cost**: Free
**Time to Setup**: 5 minutes

**Steps**:
1. Go to: https://expo.dev/signup
2. Sign up with GitHub account (recommended) or email
3. Verify email
4. Get your access token:
   - Go to https://expo.dev/accounts/[your-account]/settings/access-tokens
   - Click "Create Token"
   - Name it "Elimu Smart Mobile"
   - Copy the token (save it - you'll need it later)

**What You'll Get**:
- Expo Go app for testing on your phone
- Access to Expo EAS for builds
- Development dashboard

**Status**: [ ] Not started [ ] In progress [ ] Complete

---

### 2. Codemagic Account (FREE - 500 build minutes/month)

**What It's For**: Cloud iOS/Android builds without needing a Mac
**Cost**: Free (500 mins/month), then $0.038/min pay-as-you-go
**Time to Setup**: 10 minutes

**Steps**:
1. Go to: https://codemagic.io/signup
2. Sign up with your GitHub account
3. Grant Codemagic access to your repositories
4. Select the repository: `elimu_smart` or `elimu-smart-mobile`
5. Codemagic will auto-detect it's a React Native project

**What You'll Get**:
- Cloud Mac machines for iOS builds
- Cloud Linux for Android builds
- Automatic builds on git push
- No local Xcode or Android Studio needed

**Status**: [ ] Not started [ ] In progress [ ] Complete

---

### 3. GitHub Repository (Already Exists)

**What It's For**: Version control, CI/CD trigger
**Current Repo**: https://github.com/Iam-Were/elimu_smart

**Options**:
- **Option A**: Create new repo `elimu-smart-mobile` (recommended for clean separation)
- **Option B**: Create `mobile/` subdirectory in existing repo

**Action**: Claude will create appropriate structure once you decide

**Status**: [ ] Existing repo [ ] New repo needed [ ] Subdirectory approach

---

## 📱 Before App Store Submission (Week 5-6)

### 4. Apple Developer Account ($99/year)

**What It's For**: Publish iOS app to App Store
**Cost**: $99/year (annual renewal)
**Time to Setup**: 1-2 days (Apple verification process)

**Steps**:
1. Go to: https://developer.apple.com/programs/enroll/
2. Click "Start Your Enrollment"
3. Choose "Enroll as an individual" (unless you're a company)
4. Sign in with your Apple ID
5. Fill in personal information
6. Pay $99 fee
7. Wait for Apple verification (1-2 days)

**What You'll Need**:
- Valid Apple ID
- Credit/debit card
- Government ID (for verification)

**What You'll Get**:
- Ability to publish to App Store
- TestFlight for beta testing
- Certificates and provisioning profiles (Codemagic auto-generates these)

**When to Do This**: Week 5 (before app store submission)

**Status**: [ ] Not needed yet [ ] In progress [ ] Complete

---

### 5. Google Play Developer Account ($25 one-time)

**What It's For**: Publish Android app to Google Play Store
**Cost**: $25 one-time fee
**Time to Setup**: 30 minutes + 1-2 days verification

**Steps**:
1. Go to: https://play.google.com/console/signup
2. Sign in with Google account
3. Accept Developer Distribution Agreement
4. Pay $25 registration fee
5. Complete account details
6. Wait for verification (1-2 days)

**What You'll Need**:
- Google account
- Credit/debit card
- Developer account name (can be your name or company)

**What You'll Get**:
- Ability to publish to Google Play
- Access to Google Play Console
- Internal testing tracks for beta testing

**When to Do This**: Week 5 (before app store submission)

**Status**: [ ] Not needed yet [ ] In progress [ ] Complete

---

## 🎨 Design Assets Needed

### 6. App Logo/Icon

**What It's Needed For**: App icon, splash screen
**Format**: PNG, SVG preferred
**Required Sizes**:
- High-res: 1024x1024 px (transparent background)
- Claude will auto-generate all required sizes from this

**What Claude Needs From You**:
- [ ] Logo file (upload or provide path)
- [ ] Preferred background color for splash screen
- [ ] Any specific icon treatment (rounded, square, etc.)

**When Needed**: Before Phase 8 (app store submission)

**Status**: [ ] Not needed yet [ ] Have file ready [ ] Provided to Claude

---

## 🔐 Credentials & API Keys

### 7. Codemagic Environment Variables

**What They're For**: Build configuration, secrets management

**Variables You'll Need to Add** (Claude will provide exact values):

```bash
# Parse Server (existing backend)
PARSE_APP_ID=elimu_smart_app_2024
PARSE_SERVER_URL=https://elimu-smart.co.ke/parse
PARSE_MASTER_KEY=[from your .env file]

# Expo
EXPO_TOKEN=[from step 1 above]

# Apple (after Apple Developer account created)
APPLE_TEAM_ID=[from Apple Developer account]
APPLE_APP_ID=com.elimusmart.app

# Google (after Google Play account created)
GOOGLE_PACKAGE_NAME=com.elimusmart.app
```

**How to Add in Codemagic**:
1. Go to Codemagic dashboard
2. Select your app
3. Go to "Environment variables"
4. Add each variable as "Secret" (encrypted)

**When to Do This**: Week 5 (during Phase 7 setup)

**Status**: [ ] Not needed yet [ ] Ready to add [ ] Complete

---

### 8. Apple App Store Connect Credentials

**What They're For**: Automatic app submission to App Store

**What Codemagic Needs**:
- App Store Connect API Key (Codemagic can auto-generate)
- OR Apple ID + App-Specific Password

**How to Generate** (Option 1 - Recommended):
1. Login to App Store Connect
2. Go to Users and Access → Keys
3. Generate new API Key
4. Download the .p8 file
5. Upload to Codemagic

**When to Do This**: Week 6 (before first TestFlight build)

**Status**: [ ] Not needed yet [ ] In progress [ ] Complete

---

### 9. Google Play Service Account

**What It's For**: Automatic app submission to Google Play

**How to Generate**:
1. Go to Google Play Console
2. Setup → API access
3. Create service account
4. Download JSON key file
5. Upload to Codemagic

**When to Do This**: Week 6 (before first Google Play build)

**Status**: [ ] Not needed yet [ ] In progress [ ] Complete

---

## 🧪 Optional (Recommended)

### 10. Sentry Account (FREE tier available)

**What It's For**: Crash reporting, error tracking
**Cost**: Free for up to 5,000 events/month
**Time to Setup**: 10 minutes

**Steps**:
1. Go to: https://sentry.io/signup
2. Sign up with GitHub or email
3. Create new project → Select "React Native"
4. Get DSN (Data Source Name)
5. Claude will integrate it into the app

**When to Do This**: Optional - can add during Phase 6

**Status**: [ ] Skipping for now [ ] Want to add [ ] Complete

---

### 11. Firebase Account (FREE)

**What It's For**: Push notifications, analytics
**Cost**: Free
**Alternative**: Expo Notifications (already included)

**When to Do This**: Optional - Expo Notifications sufficient for MVP

**Status**: [ ] Using Expo Notifications [ ] Want Firebase instead

---

## 📊 Integration Status Summary

| Integration | Priority | Cost | Status | Deadline |
|-------------|----------|------|--------|----------|
| Expo | 🔴 Critical | Free | ⬜ Todo | Immediate |
| Codemagic | 🔴 Critical | Free | ⬜ Todo | Immediate |
| GitHub Repo | 🔴 Critical | Free | ✅ Exists | N/A |
| Apple Developer | 🟡 High | $99/yr | ⬜ Todo | Week 5 |
| Google Play | 🟡 High | $25 | ⬜ Todo | Week 5 |
| App Logo | 🟡 High | Free | ⬜ Todo | Week 5 |
| Codemagic Env Vars | 🟡 High | Free | ⬜ Todo | Week 5 |
| App Store Connect API | 🟡 High | Free | ⬜ Todo | Week 6 |
| Google Play Service | 🟡 High | Free | ⬜ Todo | Week 6 |
| Sentry | 🟢 Optional | Free | ⬜ Skip | Anytime |
| Firebase | 🟢 Optional | Free | ⬜ Skip | Anytime |

---

## 💡 What Claude Will Handle (You Don't Need to Do)

✅ All code generation and conversion
✅ All configuration files (codemagic.yaml, app.json, etc.)
✅ Project structure setup
✅ Dependency installation commands
✅ Build scripts
✅ App store listing drafts
✅ Screenshot generation from app
✅ Testing documentation

---

## 🚀 Quick Start Checklist (Do Today)

**To start building the mobile app, you need:**

- [ ] Sign up for Expo (5 mins) → https://expo.dev/signup
- [ ] Sign up for Codemagic (10 mins) → https://codemagic.io/signup
- [ ] Get Expo access token and save it somewhere safe
- [ ] Tell Claude: "I've signed up for Expo and Codemagic, let's start building"

**That's it!** Claude will handle everything else initially. Other accounts (Apple, Google) are only needed in Week 5-6 before app store submission.

---

## 📞 Support & Help

**If you get stuck during setup:**

1. **Expo Issues**: Check https://docs.expo.dev or Expo Discord
2. **Codemagic Issues**: Check https://docs.codemagic.io or support chat
3. **Claude Help**: Just ask "Claude, I'm stuck on [step], help me"

**Common Questions**:

**Q: Can I test the app without Expo Go?**
A: Yes, but Expo Go is the fastest way. Alternative: Codemagic builds → TestFlight/Internal Testing.

**Q: Do I need a Mac for iOS development?**
A: NO! Codemagic provides cloud Mac machines. Zero local requirements.

**Q: Can I use a personal Apple ID or do I need a developer account?**
A: You need a paid Apple Developer account ($99/year) to publish to App Store. Free Apple ID can't publish apps.

**Q: How long does Apple/Google approval take?**
A: Apple: 2-5 days, Google: 1-3 days on average.

---

**Last Updated**: 2025-10-12
**Next Review**: After Phase 1 completion

