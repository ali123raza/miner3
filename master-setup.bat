@echo off
REM ============================================
REM CloudMiner TWA - Master Setup Script
REM Complete automation for Android APK creation
REM ============================================

color 0A
title CloudMiner TWA Master Setup

echo.
echo  ============================================================
echo   CloudMiner TWA - Master Setup
echo   Convert Your Web App to Android APK
echo  ============================================================
echo.
echo  This script will guide you through the complete setup.
echo  Estimated time: 60 minutes
echo.
echo  ============================================================
echo.

pause

:MENU
cls
echo.
echo  ============================================================
echo   CloudMiner TWA Setup Menu
echo  ============================================================
echo.
echo   Current Status:
echo.

REM Check if icons exist
set ICONS_OK=0
if exist "public\icons\icon-512x512.png" set ICONS_OK=1

REM Check if build exists
set BUILD_OK=0
if exist "dist\index.html" set BUILD_OK=1

REM Check if TWA exists
set TWA_OK=0
if exist "cloudminer-twa\app-release-signed.apk" set TWA_OK=1

if %ICONS_OK%==1 (
    echo   [√] Step 1: Icons Present
) else (
    echo   [!] Step 1: Create Icons (you handle this)
)

if %BUILD_OK%==1 (
    echo   [√] Step 2: Production Build
) else (
    echo   [ ] Step 2: Production Build
)

if %TWA_OK%==1 (
    echo   [√] Step 3: Android APK Created
) else (
    echo   [ ] Step 3: Android APK
)

echo.
echo  ============================================================
echo.
echo   Choose an option:
echo.
echo   1. Verify Icons (Step 1)
echo   2. Build Production Version (Step 2)
echo   3. Create Android App (Step 3)
echo   4. Configure Asset Links (Step 4)
echo   5. View OAuth Setup Guide (Step 5)
echo.
echo   D. Verify Deployment
echo   T. Test Complete Setup
echo.
echo   H. Open Documentation
echo   Q. Quit
echo.
echo  ============================================================
echo.

set /p CHOICE="  Enter your choice: "

if /I "%CHOICE%"=="1" goto VERIFY_ICONS
if /I "%CHOICE%"=="2" goto STEP2
if /I "%CHOICE%"=="3" goto STEP3
if /I "%CHOICE%"=="4" goto STEP4
if /I "%CHOICE%"=="5" goto STEP5
if /I "%CHOICE%"=="D" goto VERIFY_DEPLOY
if /I "%CHOICE%"=="T" goto TEST_ALL
if /I "%CHOICE%"=="H" goto DOCS
if /I "%CHOICE%"=="Q" goto END

goto MENU

:STEP2
cls
echo.
echo  ============================================================
echo   Step 2: Build Production Version
echo  ============================================================
echo.
echo  Verifying icons first...
node verify-icons.cjs
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: Icons not found!
    echo  Please complete Step 1 first.
    echo.
    pause
    goto MENU
)
echo.
echo  Building production version...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: Build failed!
    echo.
    pause
    goto MENU
)
echo.
echo  ============================================================
echo   Build Complete!
echo  ============================================================
echo.
echo  Next: Deploy twa-deploy/ contents to your production server
echo.
pause
goto MENU

:STEP3
cls
echo.
echo  ============================================================
echo   Step 3: Create Android App
echo  ============================================================
echo.
echo  This will run the automated Bubblewrap setup.
echo.
set /p CONFIRM="  Continue? (Y/N): "
if /I "%CONFIRM%" NEQ "Y" goto MENU
echo.
node setup-twa.js
echo.
pause
goto MENU

:STEP4
cls
echo.
echo  ============================================================
echo   Step 4: Configure Digital Asset Links
echo  ============================================================
echo.
node configure-asset-links.js
echo.
pause
goto MENU

:STEP5
cls
echo.
echo  ============================================================
echo   Step 5: Google OAuth Setup
echo  ============================================================
echo.
echo  Opening GOOGLE_OAUTH_SETUP.md...
echo.
start GOOGLE_OAUTH_SETUP.md
echo.
echo  Follow the guide to configure Google OAuth.
echo.
pause
goto MENU

:VERIFY_ICONS
cls
echo.
echo  ============================================================
echo   Verify Icons
echo  ============================================================
echo.
node verify-icons.cjs
echo.
pause
goto MENU

:VERIFY_DEPLOY
cls
echo.
echo  ============================================================
echo   Verify Deployment
echo  ============================================================
echo.
set /p DOMAIN="  Enter your domain (e.g., cloudminer.app): "
if "%DOMAIN%"=="" (
    echo  ERROR: Domain required!
    pause
    goto MENU
)
echo.
node verify-deployment.js %DOMAIN%
echo.
pause
goto MENU

:TEST_ALL
cls
echo.
echo  ============================================================
echo   Test Complete Setup
echo  ============================================================
echo.
echo  Running all verification checks...
echo.
echo  1. Verifying icons...
node verify-icons.cjs
if %ERRORLEVEL% NEQ 0 (
    echo  ERROR: Icons verification failed!
    pause
    goto MENU
)
echo.
echo  2. Checking build...
if not exist "dist\index.html" (
    echo  ERROR: Production build not found!
    echo  Run Step 2 first.
    pause
    goto MENU
)
echo  OK: Production build exists
echo.
echo  3. Checking TWA project...
if not exist "cloudminer-twa" (
    echo  ERROR: TWA project not found!
    echo  Run Step 3 first.
    pause
    goto MENU
)
echo  OK: TWA project exists
echo.
echo  ============================================================
echo   Summary
echo  ============================================================
echo.
echo  [√] Icons verified
echo  [√] Production build exists
echo  [√] TWA project created
echo.
echo  Next steps:
echo  1. Deploy to production server
echo  2. Configure Asset Links (Step 4)
echo  3. Configure Google OAuth (Step 5)
echo  4. Test on Android device
echo.
pause
goto MENU

:DOCS
cls
echo.
echo  ============================================================
echo   Documentation
echo  ============================================================
echo.
echo  Available documentation:
echo.
echo  1. START_HERE.md                  - Quick start guide
echo  2. IMPLEMENTATION_COMPLETE.md     - What's done
echo  3. TWA_QUICK_START.md            - 30-min guide
echo  4. TWA_IMPLEMENTATION_GUIDE.md   - Complete guide
echo  5. TWA_DEPLOYMENT_CHECKLIST.md   - Checklist
echo  6. GOOGLE_OAUTH_SETUP.md         - OAuth setup
echo.
set /p DOC="  Enter number to open (or ENTER to go back): "
if "%DOC%"=="1" start START_HERE.md
if "%DOC%"=="2" start IMPLEMENTATION_COMPLETE.md
if "%DOC%"=="3" start TWA_QUICK_START.md
if "%DOC%"=="4" start TWA_IMPLEMENTATION_GUIDE.md
if "%DOC%"=="5" start TWA_DEPLOYMENT_CHECKLIST.md
if "%DOC%"=="6" start GOOGLE_OAUTH_SETUP.md
goto MENU

:END
cls
echo.
echo  ============================================================
echo   Thank you for using CloudMiner TWA Setup!
echo  ============================================================
echo.
echo  For help, refer to the documentation:
echo  - START_HERE.md
echo  - TWA_IMPLEMENTATION_GUIDE.md
echo.
echo  Good luck with your Android app!
echo.
pause
exit
