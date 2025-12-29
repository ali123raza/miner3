@echo off
setlocal

echo ========================================
echo CloudMiner TWA Build Script
echo ========================================
echo.

REM Set JAVA_HOME to JDK 21
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Java Home: %JAVA_HOME%
echo.

REM Change to TWA directory
cd /d "%~dp0cloudminer-twa"

echo Current Directory: %CD%
echo.

echo Checking Gradle Wrapper...
if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo ERROR: Gradle wrapper JAR not found!
    echo Please ensure gradle\wrapper\gradle-wrapper.jar exists
    pause
    exit /b 1
)

echo.
echo Building APK (this may take several minutes on first run)...
echo.

REM Build debug APK (faster, no signing required)
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Debug APK: cloudminer-twa\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To build signed release APK, run:
    echo gradlew.bat assembleRelease
    echo.
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo.
    echo Common issues:
    echo 1. Java not installed or JAVA_HOME incorrect
    echo 2. Internet connection needed for first build
    echo 3. Gradle wrapper not downloaded
    echo.
)

pause
endlocal
