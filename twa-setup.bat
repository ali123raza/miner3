@echo off
REM ============================================
REM CloudMiner TWA Setup Script (Windows)
REM ============================================
REM This script helps you set up the Android TWA app
REM Run this AFTER deploying your website to production

echo.
echo ============================================
echo CloudMiner TWA Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Step 1: Checking Bubblewrap installation...
echo.

REM Check if Bubblewrap is installed
call npx @bubblewrap/cli --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Bubblewrap is not installed. Installing now...
    echo.
    call npm install -g @bubblewrap/cli
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Bubblewrap!
        echo.
        pause
        exit /b 1
    )
) else (
    echo Bubblewrap is already installed!
)

echo.
echo ============================================
echo IMPORTANT: Before continuing, ensure:
echo ============================================
echo.
echo 1. Your website is deployed to production (HTTPS)
echo 2. manifest.json is accessible at /manifest.json
echo 3. Icons are uploaded to /icons/icon-*.png
echo 4. assetlinks.json is uploaded to /.well-known/assetlinks.json
echo.
echo ============================================
echo.

set /p CONTINUE="Have you completed the above steps? (Y/N): "
if /I "%CONTINUE%" NEQ "Y" (
    echo.
    echo Please complete the steps above before running this script.
    echo See TWA_IMPLEMENTATION_GUIDE.md for detailed instructions.
    echo.
    pause
    exit /b 0
)

echo.
echo Step 2: Enter your production website URL
echo.
set /p DOMAIN="Enter your domain (example: yourdomain.com): "

if "%DOMAIN%"=="" (
    echo ERROR: Domain cannot be empty!
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Enter your Android app package name
echo.
set /p PACKAGE="Enter package name (example: com.cloudminer.app): "

if "%PACKAGE%"=="" (
    echo ERROR: Package name cannot be empty!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Creating TWA project directory...
echo ============================================
echo.

REM Create TWA directory
if not exist "cloudminer-twa" (
    mkdir cloudminer-twa
    echo Created: cloudminer-twa directory
) else (
    echo Warning: cloudminer-twa directory already exists!
    set /p OVERWRITE="Overwrite existing project? (Y/N): "
    if /I "%OVERWRITE%" NEQ "Y" (
        echo Cancelled.
        pause
        exit /b 0
    )
)

cd cloudminer-twa

echo.
echo ============================================
echo Initializing Bubblewrap TWA...
echo ============================================
echo.

REM Initialize Bubblewrap with user inputs
call npx @bubblewrap/cli init --manifest=https://%DOMAIN%/manifest.json

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Bubblewrap initialization failed!
    echo.
    echo Possible reasons:
    echo 1. manifest.json is not accessible at https://%DOMAIN%/manifest.json
    echo 2. Icons are not accessible
    echo 3. Invalid domain or network issue
    echo.
    echo Please fix the issues and run this script again.
    echo.
    cd ..
    pause
    exit /b 1
)

echo.
echo ============================================
echo TWA Project Created Successfully!
echo ============================================
echo.
echo Project location: cloudminer-twa/
echo.
echo Next steps:
echo.
echo 1. Build the app:
echo    cd cloudminer-twa
echo    npx @bubblewrap/cli build
echo.
echo 2. Get SHA-256 fingerprint:
echo    keytool -list -v -keystore android.keystore -alias cloudminer-key
echo.
echo 3. Update assetlinks.json with the SHA-256 fingerprint
echo.
echo 4. Test on device:
echo    adb install app-release-signed.apk
echo.
echo See TWA_IMPLEMENTATION_GUIDE.md for complete instructions.
echo.

cd ..
pause
