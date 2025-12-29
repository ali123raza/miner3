@echo off
echo ======================================
echo Create Android Keystore for TWA
echo ======================================
echo.

REM Check if keystore already exists
if exist "my-release-key.keystore" (
    echo Keystore already exists: my-release-key.keystore
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 (
        echo Aborted.
        pause
        exit /b 0
    )
    echo Deleting existing keystore...
    del my-release-key.keystore
)

REM Check for Java
where keytool >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: keytool is not found in PATH
    echo Please install JDK and ensure JAVA_HOME is set
    pause
    exit /b 1
)

echo Creating new keystore...
echo.

keytool -genkey -v -keystore my-release-key.keystore -alias techchip-key -keyalg RSA -keysize 2048 -validity 10000 -storepass techchip8621772 -keypass techchip8621772 -dname "CN=CloudMiner, OU=Development, O=CloudMiner, L=City, ST=State, C=US"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================
    echo KEYSTORE CREATED SUCCESSFULLY!
    echo ======================================
    echo.
    echo File: my-release-key.keystore
    echo Alias: techchip-key
    echo Password: techchip8621772
    echo.
    echo IMPORTANT: Keep this file and password safe!
    echo You'll need them to sign future app updates.
    echo.
) else (
    echo.
    echo ======================================
    echo KEYSTORE CREATION FAILED!
    echo ======================================
    echo.
    echo Check the error messages above.
    echo.
)

pause
