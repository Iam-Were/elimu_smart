# PWA Icon Assets Required

## Overview
The PWA (Progressive Web App) configuration requires specific icon files to be created and placed in the `frontend/public/` directory.

## Required Icons

### 1. **pwa-192x192.png**
- **Size**: 192x192 pixels
- **Format**: PNG with transparency
- **Purpose**: Standard PWA icon for home screen (Android)
- **Design**: Elimu Smart logo with orange (#f97316) theme
- **Location**: `frontend/public/pwa-192x192.png`

### 2. **pwa-512x512.png**
- **Size**: 512x512 pixels
- **Format**: PNG with transparency
- **Purpose**: High-resolution PWA icon, splash screen
- **Design**: Same as 192x192 but higher resolution
- **Location**: `frontend/public/pwa-512x512.png`

### 3. **favicon.ico** (Optional but recommended)
- **Size**: 32x32 pixels (multi-size ICO)
- **Format**: ICO
- **Purpose**: Browser tab icon
- **Design**: Simple Elimu Smart icon
- **Location**: `frontend/public/favicon.ico`

### 4. **apple-touch-icon.png** (Optional but recommended)
- **Size**: 180x180 pixels
- **Format**: PNG without transparency (solid background)
- **Purpose**: iOS home screen icon
- **Design**: Elimu Smart logo on solid background
- **Location**: `frontend/public/apple-touch-icon.png`

### 5. **masked-icon.svg** (Optional)
- **Format**: SVG
- **Purpose**: Safari pinned tab icon
- **Design**: Monochrome vector version
- **Location**: `frontend/public/masked-icon.svg`

## Design Guidelines

### Color Palette
- **Primary Orange**: #f97316 (Elimu Smart brand color)
- **Background**: White (#ffffff) or transparent
- **Text/Icon**: Use high contrast

### Icon Content
- Should feature "Elimu Smart" branding
- Consider using:
  - Graduation cap symbol
  - Book/education symbol
  - "ES" monogram
  - Career/growth arrow symbol
- Keep design simple and recognizable at small sizes

### Technical Requirements
- **File Format**: PNG-24 with alpha channel (transparency)
- **Color Space**: sRGB
- **Resolution**: 72 DPI minimum
- **Optimization**: Use tools like TinyPNG to compress without quality loss

## How to Create Icons

### Option 1: Design Tool (Recommended)
1. Create master design at 512x512px in Figma/Adobe Illustrator
2. Export at required sizes
3. Optimize with TinyPNG or ImageOptim
4. Place in `frontend/public/` directory

### Option 2: Online Icon Generator
Use services like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

### Option 3: Existing Logo
If you have an existing Elimu Smart logo:
1. Resize to 512x512px (maintain aspect ratio with padding)
2. Export as PNG
3. Use online tools to generate other sizes

## Verification

After creating icons, verify they appear correctly:

### Local Testing
```bash
npm run build
npm run preview
```
Then visit http://localhost:4173 and check:
- Browser tab icon (favicon)
- PWA manifest (DevTools → Application → Manifest)

### Production Testing
After deployment:
- **Android Chrome**: Look for install prompt, check home screen icon
- **iOS Safari**: Share → Add to Home Screen, check icon appearance
- **Desktop**: Check browser tab, install prompt

## Current Status

✅ PWA configuration complete in `vite.config.ts`
✅ Web app manifest configured with correct paths
✅ Install prompt component created
⏳ **PENDING**: Icon files need to be created and placed in `frontend/public/`

## Next Steps

1. Create or obtain Elimu Smart logo design
2. Generate all required icon sizes
3. Place files in `frontend/public/` directory with exact names above
4. Rebuild application: `npm run build`
5. Test PWA install on Android Chrome and iOS Safari
6. Deploy to production: `https://elimu-smart.co.ke`

## Notes

- Icons are critical for PWA installation - users won't install without proper icons
- iOS requires solid background (no transparency) for apple-touch-icon
- Test on real devices to ensure icons look professional
- Consider A/B testing different icon designs for conversion rates
