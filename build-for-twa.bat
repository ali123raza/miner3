@echo off
REM ============================================
REM Build CloudMiner for TWA Deployment
REM ============================================

echo.
echo ============================================
echo CloudMiner TWA Production Build
echo ============================================
echo.

REM Step 1: Verify icons
echo Step 1: Verifying icons...
echo.
node verify-icons.cjs
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Icons are missing!
    echo.
    echo Please generate icons first:
    echo 1. Open: icon-generator.html in your browser
    echo 2. Click "Generate All Icons"
    echo 3. Download each icon to public/icons/
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Step 2: Building production version...
echo ============================================
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Step 3: Preparing deployment package...
echo ============================================
echo.

REM Create deployment directory
if not exist "twa-deploy" mkdir twa-deploy

REM Copy dist files
echo Copying dist files...
xcopy /E /I /Y dist twa-deploy\

REM Copy additional TWA files
echo Copying manifest.json...
copy public\manifest.json twa-deploy\manifest.json

echo Copying sw.js...
copy public\sw.js twa-deploy\sw.js

echo Copying offline.html...
copy public\offline.html twa-deploy\offline.html

echo Copying icons...
xcopy /E /I /Y public\icons twa-deploy\icons\

echo Copying .well-known...
xcopy /E /I /Y public\.well-known twa-deploy\.well-known\

echo.
echo ============================================
echo Build Complete!
echo ============================================
echo.
echo Deployment package created in: twa-deploy/
echo.
echo Next steps:
echo.
echo 1. Upload twa-deploy/ contents to your production server
echo    Target: https://yourdomain.com/
echo.
echo 2. Verify deployment:
echo    https://yourdomain.com/manifest.json
echo    https://yourdomain.com/icons/icon-512x512.png
echo    https://yourdomain.com/.well-known/assetlinks.json
echo.
echo 3. Run Bubblewrap:
echo    twa-setup.bat
echo.
pause
