# PWA Deployment & Testing Guide - Elimu Smart

## 🎯 Overview

This guide covers deploying and testing the Progressive Web App (PWA) functionality for Elimu Smart.

---

## 📋 Pre-Deployment Checklist

### ✅ Required Assets (Create Before Deployment)

1. **PWA Icons** - Place in `frontend/public/`:
   - [ ] `pwa-192x192.png` (192×192 pixels)
   - [ ] `pwa-512x512.png` (512×512 pixels)
   - [ ] `favicon.ico` (32×32 pixels, optional but recommended)
   - [ ] `apple-touch-icon.png` (180×180 pixels, iOS)
   - [ ] `masked-icon.svg` (Safari pinned tab, optional)

**Temporary Solution**: Until professional icons are created, you can use free icon generators:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- Use Elimu Smart brand color: #f97316 (orange)

### ✅ Build Verification

```bash
cd frontend
npm run build
```

Expected output:
```
✓ built in ~1m
PWA v1.1.0
mode      generateSW
precache  81 entries (3468.58 KiB)
files generated
  dist/sw.js
  dist/workbox-*.js
```

---

## 🚀 Deployment Steps

### Step 1: Build for Production

```bash
cd frontend
npm run build
```

This generates:
- `dist/` - Production build
- `dist/sw.js` - Service worker
- `dist/manifest.webmanifest` - PWA manifest
- `dist/workbox-*.js` - Cache management

### Step 2: Deploy to VPS

```bash
# On your local machine
cd frontend
npm run build

# Copy to VPS
scp -r dist/* root@145.239.42.121:/var/www/elimu-smart/

# OR via git (recommended)
git add .
git commit -m "feat: Add PWA support with offline caching and install prompt"
git push origin main

# Then on VPS
ssh root@145.239.42.121
cd /root/elimu_smart
git pull origin main
cd frontend
npm install  # Install vite-plugin-pwa
npm run build
sudo cp -r dist/* /var/www/elimu-smart/
```

### Step 3: Verify Server Configuration

#### Nginx Configuration Check

PWA requires proper MIME types and HTTPS. Verify your nginx config includes:

```nginx
# /etc/nginx/sites-available/elimu-smart

server {
    listen 443 ssl http2;
    server_name elimu-smart.co.ke;

    # SSL certificates (already configured)
    ssl_certificate /etc/letsencrypt/live/elimu-smart.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elimu-smart.co.ke/privkey.pem;

    root /var/www/elimu-smart;
    index index.html;

    # PWA CRITICAL: Proper MIME types
    types {
        application/manifest+json webmanifest;
        application/javascript js;
        text/css css;
    }

    # Service worker must be served with correct headers
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
        add_header Service-Worker-Allowed "/";
        types { application/javascript js; }
    }

    # Workbox files
    location /workbox- {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Manifest file
    location /manifest.webmanifest {
        add_header Cache-Control "public, max-age=86400";
        types { application/manifest+json webmanifest; }
    }

    # SPA routing - all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Reload Nginx:**
```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## 🧪 Testing Procedures

### Test 1: Service Worker Registration (Desktop)

1. **Open DevTools** (Chrome/Edge)
   - Press F12
   - Go to **Application** tab
   - Click **Service Workers**

2. **Expected Results:**
   - ✅ Status: "activated and is running"
   - ✅ Source: `sw.js`
   - ✅ Scope: https://elimu-smart.co.ke/

3. **Test Offline Mode:**
   - Check "Offline" checkbox in Service Workers section
   - Refresh page
   - ✅ App should still load (from cache)
   - ❌ API calls will fail (expected) but UI shows cached data

### Test 2: PWA Manifest (Desktop)

1. **Open DevTools → Application → Manifest**

2. **Expected Values:**
   ```
   Name: Elimu Smart - Career Guidance
   Short name: Elimu Smart
   Start URL: /
   Theme color: #f97316
   Background: #ffffff
   Display: standalone
   Orientation: portrait
   Icons: 2 icons (192x192, 512x512)
   ```

3. **Verify Icons:**
   - Click each icon URL
   - Should display orange-themed Elimu Smart logo
   - If 404 error → Icons not deployed (fix needed)

### Test 3: Install Prompt (Android Chrome)

#### Device Requirements:
- Android phone with Chrome browser
- NOT in incognito mode
- HTTPS enabled (https://elimu-smart.co.ke)

#### Test Steps:

1. **Visit Site** (First Time User)
   ```
   Open Chrome → https://elimu-smart.co.ke
   ```

2. **Wait 5 Seconds**
   - Install prompt should appear at bottom of screen
   - Shows "Install Elimu Smart App" card
   - Has orange gradient icon and "Install App" button

3. **Click "Install App"**
   - Chrome shows native install dialog
   - Displays app name, icon, and URL
   - Click "Install"

4. **Verify Installation:**
   - App icon appears on home screen
   - Tap icon → App opens in standalone mode (no browser UI)
   - Status bar matches app theme (orange)

#### Troubleshooting:

**Prompt doesn't appear?**
- Check: Valid HTTPS certificate
- Check: manifest.webmanifest accessible at https://elimu-smart.co.ke/manifest.webmanifest
- Check: Icons exist (192x192, 512x512)
- Check: Not already installed
- Check: Service worker registered successfully

**Manual Install (if prompt doesn't work):**
- Chrome menu (⋮) → "Install app" or "Add to Home screen"

### Test 4: iOS Safari Install

#### Device Requirements:
- iPhone/iPad with Safari
- iOS 11.3 or later

#### Test Steps:

1. **Visit Site**
   ```
   Safari → https://elimu-smart.co.ke
   ```

2. **Check Install Prompt**
   - After 5 seconds, should see instructions card
   - Shows: "Tap Share button ⎋ → Add to Home Screen"

3. **Manual Install:**
   - Tap Share button (bottom center, box with arrow)
   - Scroll down → "Add to Home Screen"
   - Edit name if desired → "Add"

4. **Verify Installation:**
   - Icon on home screen
   - Tap → Opens in standalone mode
   - No Safari UI visible

#### iOS Limitations:
- ❌ No automatic install prompt (Apple restriction)
- ❌ Push notifications not supported (yet)
- ✅ Offline mode works
- ✅ Standalone app experience

### Test 5: Offline Functionality

1. **Load App Online**
   - Visit https://elimu-smart.co.ke
   - Navigate to dashboard, assessments
   - Wait for service worker to cache assets

2. **Go Offline**
   - **Android**: Enable Airplane mode
   - **Desktop**: DevTools → Network → Offline

3. **Test App:**
   - ✅ Homepage loads
   - ✅ Dashboard loads
   - ✅ Cached assessment questions appear
   - ❌ New API calls fail gracefully (show cached data)
   - ✅ UI remains functional

4. **Verify Cache:**
   - DevTools → Application → Cache Storage
   - Should see: `workbox-precache-v2-*`
   - Contains: JS, CSS, HTML, fonts, images

### Test 6: Update Flow

1. **Deploy New Version**
   ```bash
   npm run build
   sudo cp -r dist/* /var/www/elimu-smart/
   ```

2. **User Opens App**
   - Service worker detects new version
   - Downloads update in background
   - Applies on next app reload

3. **Verify Update:**
   - DevTools → Application → Service Workers
   - Should show "waiting to activate" (new version)
   - Close all tabs → Reopen
   - New version activates

---

## 📊 PWA Audit (Chrome Lighthouse)

### Run Lighthouse Audit:

1. **Desktop Chrome:**
   - F12 → Lighthouse tab
   - Select "Progressive Web App"
   - Click "Generate report"

2. **Expected Scores:**
   - PWA: 100/100 ✅
   - Fast and reliable: ✅
   - Installable: ✅
   - PWA optimized: ✅

3. **Key Checks:**
   - ✅ Registers a service worker
   - ✅ Responds with 200 when offline
   - ✅ Has a `<meta name="viewport">` tag
   - ✅ Configured for custom splash screen
   - ✅ Sets a theme color
   - ✅ Provides a valid manifest
   - ✅ Has a maskable icon (if provided)

### Common Issues:

**"Page does not work offline"**
- Service worker not registered
- Check: DevTools → Console for errors

**"Web app manifest does not meet installability requirements"**
- Missing icons (192x192, 512x512)
- Invalid manifest.webmanifest
- Fix: Add missing icon files

**"Does not provide a valid apple-touch-icon"**
- Warning only (not critical)
- Add `apple-touch-icon.png` to fix

---

## 🎨 Icon Creation Quick Guide

### If You Don't Have Icons Yet:

#### Option 1: Use PWA Builder (Fastest)
```bash
# Visit with any square logo/image
https://www.pwabuilder.com/imageGenerator

# Upload image
# Download generated icons
# Extract to frontend/public/
```

#### Option 2: Use Figma/Canva (Best Quality)
1. Create 512×512 canvas
2. Design with Elimu Smart branding
3. Export as PNG
4. Resize to 192×192 using:
   - https://www.iloveimg.com/resize-image
   - Or ImageMagick: `convert pwa-512x512.png -resize 192x192 pwa-192x192.png`

#### Option 3: Temporary Favicon.io
```bash
# Visit https://favicon.io/favicon-generator/
# Enter "ES" (Elimu Smart initials)
# Background: #f97316 (orange)
# Text: #ffffff (white)
# Download → Extract → Rename files
```

---

## 🚨 Troubleshooting

### Issue: "Add to Home Screen" Not Showing (Android)

**Causes:**
1. Already installed
2. Not HTTPS
3. No valid service worker
4. Missing manifest
5. Missing icons

**Fix:**
```bash
# Check manifest
curl -I https://elimu-smart.co.ke/manifest.webmanifest
# Should return: 200 OK
# Content-Type: application/manifest+json

# Check service worker
curl -I https://elimu-smart.co.ke/sw.js
# Should return: 200 OK

# Check icons
curl -I https://elimu-smart.co.ke/pwa-192x192.png
curl -I https://elimu-smart.co.ke/pwa-512x512.png
# Should return: 200 OK
```

### Issue: Service Worker Not Registering

**Check Console:**
```javascript
// DevTools → Console
// Should see: [vite-plugin-pwa] Service worker registered
```

**Manual Test:**
```javascript
// DevTools → Console → Run:
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs))
// Should show array with 1 registration
```

**Fix:**
- Clear browser cache (Ctrl+Shift+Del)
- Unregister old service worker (DevTools → Application → Service Workers → Unregister)
- Hard refresh (Ctrl+Shift+R)

### Issue: Updates Not Applying

**Force Update:**
```javascript
// DevTools → Application → Service Workers
// Click "skipWaiting" on waiting service worker
// Refresh page
```

**Or Clear Cache:**
```javascript
// DevTools → Application → Storage → Clear site data
// Refresh page
```

---

## 📈 Success Metrics

### Week 1 After Deployment:
- [ ] PWA install prompt shows on 80%+ Android users
- [ ] 10%+ install rate from prompt
- [ ] Service worker caching 90%+ assets
- [ ] Offline mode tested and working

### Month 1:
- [ ] 500+ PWA installs
- [ ] 70%+ PWA users return (vs 40% web)
- [ ] Page load time < 2s (cached)
- [ ] Lighthouse PWA score: 100/100

---

## 📚 Additional Resources

- **PWA Checklist**: https://web.dev/pwa-checklist/
- **Service Worker Cookbook**: https://serviceworke.rs/
- **Workbox Docs**: https://developer.chrome.com/docs/workbox/
- **Testing PWAs**: https://web.dev/learn/pwa/testing/

---

## ✅ Final Checklist Before Going Live

- [ ] Icons created and placed in `frontend/public/`
- [ ] Build completes without errors (`npm run build`)
- [ ] Manifest accessible at `/manifest.webmanifest`
- [ ] Service worker registers in DevTools
- [ ] Offline mode works (load page → go offline → refresh)
- [ ] Install prompt appears on Android Chrome
- [ ] iOS "Add to Home Screen" works
- [ ] Lighthouse PWA audit passes (score 90+)
- [ ] HTTPS enabled (required for PWA)
- [ ] Deployed to https://elimu-smart.co.ke
- [ ] Tested on real Android device
- [ ] Tested on real iOS device

---

## 🎉 Deployment Complete!

Once all checks pass, your PWA is ready for users to install directly from https://elimu-smart.co.ke!

**Next Steps:**
- Monitor install metrics (Google Analytics PWA events)
- Collect user feedback on install experience
- Iterate on icon design based on home screen appearance
- Proceed to Phase 2: Capacitor integration for app stores
