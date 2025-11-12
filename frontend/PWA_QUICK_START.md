# PWA Quick Start - Elimu Smart

## 🚀 One-Time Setup (First Time Only)

### 1. Create Icons (5 minutes)
Use https://www.pwabuilder.com/imageGenerator:
1. Upload any square Elimu Smart logo
2. Download generated icons
3. Place these files in `frontend/public/`:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `favicon.ico` (optional)
   - `apple-touch-icon.png` (optional)

### 2. Build & Deploy
```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/elimu-smart/
```

### 3. Test on Phone
- Android Chrome: Visit https://elimu-smart.co.ke → Install prompt appears
- iOS Safari: Visit → Share → "Add to Home Screen"

**Done! PWA is live.** ✅

---

## 🔄 Daily Development Workflow

### Make Changes → Deploy

```bash
cd frontend

# Make your code changes...

npm run build                              # Build with PWA
sudo cp -r dist/* /var/www/elimu-smart/  # Deploy
```

### Test Changes

**Desktop:**
```bash
# Local testing
npm run dev  # Service worker works in dev mode

# Open: http://localhost:5173
# Check: DevTools → Application → Service Workers
```

**Mobile:**
- Visit https://elimu-smart.co.ke
- Updates download automatically in background
- Close/reopen app → New version loads

---

## 🎯 Common Tasks

### Check if PWA is Working
```bash
# Visit on Android Chrome
https://elimu-smart.co.ke

# Look for:
✅ Install button in address bar
✅ Install prompt card (after 5 sec)
✅ Works offline (airplane mode)
```

### Clear PWA Cache (Testing)
**Desktop:**
- DevTools → Application → Storage → "Clear site data"
- Hard refresh (Ctrl+Shift+R)

**Mobile:**
- Chrome → Settings → Site settings → elimu-smart.co.ke → "Clear & reset"

### Force Update (Development)
```bash
# After deploy, users see update within 24 hours
# Force immediate update:
# DevTools → Application → Service Workers → "skipWaiting" button
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No install prompt | Check icons exist: `curl https://elimu-smart.co.ke/pwa-192x192.png` |
| Not working offline | Check service worker: DevTools → Application → Service Workers |
| Updates not applying | Clear cache OR close all tabs and reopen |
| iOS not installing | Use Safari → Share → "Add to Home Screen" (manual only) |

---

## 📁 Key Files

```
frontend/
├── vite.config.ts                     # PWA configuration ✅
├── src/
│   ├── App.tsx                        # Install prompt integrated ✅
│   └── components/common/
│       └── PwaInstallPrompt.tsx       # Install UI ✅
├── public/
│   ├── pwa-192x192.png               # ⏳ CREATE THIS
│   ├── pwa-512x512.png               # ⏳ CREATE THIS
│   ├── favicon.ico                    # ⏳ Optional
│   └── apple-touch-icon.png          # ⏳ Optional
└── dist/                              # Generated after build
    ├── sw.js                          # Service worker ✅
    ├── workbox-*.js                   # Cache manager ✅
    └── manifest.webmanifest           # PWA metadata ✅
```

---

## 🎉 That's It!

PWA is fully configured. Just add icons and deploy. Users can install from browser!

**Full docs:** See `PWA_DEPLOYMENT_GUIDE.md` for complete testing procedures.
