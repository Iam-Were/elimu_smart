@echo off
REM Elimu Smart PWA Deployment Script (Windows)
REM This script builds and deploys the PWA to production

setlocal enabledelayedexpansion

echo ================================
echo    Elimu Smart PWA Deployment
echo ================================
echo.

REM Step 1: Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Must run from frontend directory
    exit /b 1
)

echo [INFO] Pre-deployment checks...
echo.

REM Step 2: Check if icons exist
set MISSING_ICONS=0
if not exist "public\pwa-192x192.png" (
    echo [WARNING] Missing: public\pwa-192x192.png
    set MISSING_ICONS=1
)
if not exist "public\pwa-512x512.png" (
    echo [WARNING] Missing: public\pwa-512x512.png
    set MISSING_ICONS=1
)

if !MISSING_ICONS!==1 (
    echo.
    echo [WARNING] PWA icons are missing!
    echo.
    echo To create icons:
    echo 1. Open: frontend\create-pwa-icons.html in browser
    echo 2. Download all icons
    echo 3. Place them in frontend\public\
    echo.
    echo Or use online generator:
    echo https://www.pwabuilder.com/imageGenerator
    echo.
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "!CONTINUE!"=="y" exit /b 1
) else (
    echo [OK] Icons found
)

REM Step 3: Install dependencies if needed
if not exist "node_modules\vite-plugin-pwa" (
    echo [INFO] Installing dependencies...
    call npm install
)

REM Step 4: Run linter
echo.
echo [INFO] Running linter...
call npm run lint
if errorlevel 1 (
    echo [ERROR] Lint failed
    exit /b 1
)
echo [OK] Lint passed

REM Step 5: Build production bundle
echo.
echo [INFO] Building production bundle...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)
echo [OK] Build successful

REM Step 6: Check if service worker was generated
if not exist "dist\sw.js" (
    echo [ERROR] Service worker not generated
    exit /b 1
)
echo [OK] Service worker generated

REM Step 7: Display build info
echo.
echo ================================
echo        Build Complete!
echo ================================
echo.
echo Build Summary:
dir dist\sw.js | findstr "sw.js"
dir dist\index.html | findstr "index.html"
echo.

REM Step 8: Deployment instructions
echo ================================
echo     Deployment to Production
echo ================================
echo.
echo Target: root@145.239.42.121:/var/www/elimu-smart/
echo.
echo Option 1: Deploy via Git (Recommended)
echo -----------------------------------------
echo 1. git add .
echo 2. git commit -m "feat: Deploy PWA with icons"
echo 3. git push origin main
echo 4. ssh root@145.239.42.121
echo 5. cd /root/elimu_smart ^&^& git pull
echo 6. cd frontend ^&^& npm install ^&^& npm run build
echo 7. sudo cp -r dist/* /var/www/elimu-smart/
echo.
echo Option 2: Deploy via SCP (Direct)
echo -----------------------------------------
echo Run this command:
echo scp -r dist/* root@145.239.42.121:/var/www/elimu-smart/
echo.

set /p DEPLOY_METHOD="Choose deployment method (1=Git, 2=SCP, N=Skip): "

if /i "!DEPLOY_METHOD!"=="1" (
    echo.
    echo [INFO] Preparing Git deployment...
    echo.
    echo Run these commands manually:
    echo   git add .
    echo   git commit -m "feat: Deploy PWA with icons"
    echo   git push origin main
    echo.
    echo Then on VPS:
    echo   ssh root@145.239.42.121
    echo   cd /root/elimu_smart ^&^& git pull
    echo   cd frontend ^&^& npm install ^&^& npm run build
    echo   sudo cp -r dist/* /var/www/elimu-smart/
    echo.
    pause
) else if /i "!DEPLOY_METHOD!"=="2" (
    echo.
    echo [INFO] Deploying via SCP...
    echo.
    scp -r dist/* root@145.239.42.121:/var/www/elimu-smart/
    if errorlevel 1 (
        echo [ERROR] SCP deployment failed
        exit /b 1
    )
    echo [OK] Deployment successful
    echo.

    REM Verify deployment
    echo [INFO] Verifying deployment...
    curl -s -o nul -w "Service Worker: %%{http_code}" https://elimu-smart.co.ke/sw.js
    echo.
    curl -s -o nul -w "Manifest: %%{http_code}" https://elimu-smart.co.ke/manifest.webmanifest
    echo.
    curl -s -o nul -w "Main Page: %%{http_code}" https://elimu-smart.co.ke/
    echo.
) else (
    echo.
    echo [INFO] Deployment skipped. Build files are in dist\
)

echo.
echo ================================
echo      Testing Your PWA
echo ================================
echo.
echo Desktop: https://elimu-smart.co.ke
echo   - Open DevTools (F12)
echo   - Application -^> Service Workers (check registration)
echo   - Application -^> Manifest (check icons)
echo   - Network -^> Offline checkbox (test offline mode)
echo.
echo Android Chrome:
echo   - Visit https://elimu-smart.co.ke
echo   - Wait 5 seconds for install prompt
echo   - Click "Install App"
echo.
echo iOS Safari:
echo   - Visit https://elimu-smart.co.ke
echo   - Tap Share button
echo   - Select "Add to Home Screen"
echo.
echo ================================
echo       PWA Deployment Done!
echo ================================
echo.
pause
