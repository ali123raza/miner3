@echo off
echo ============================================
echo GitHub Authentication and Push
echo ============================================
echo.
echo Repository: https://github.com/ali123raza/miner3.git
echo Branch: main
echo.
echo ============================================
echo IMPORTANT: Authentication Required
echo ============================================
echo.
echo You need a GitHub Personal Access Token (PAT) to push.
echo.
echo If you don't have one yet:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it a name (e.g., "miner3-push")
echo 4. Select scope: "repo" (full control)
echo 5. Click "Generate token"
echo 6. Copy the token
echo.
echo ============================================
echo.

set /p USERNAME="Enter your GitHub username (ali123raza): "
if "%USERNAME%"=="" set USERNAME=ali123raza

echo.
echo Please enter your Personal Access Token (PAT) when prompted
echo (Token will be hidden)
echo.

REM Push using the token in URL
echo Pushing to GitHub...
git push https://%USERNAME%@github.com/ali123raza/miner3.git main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo SUCCESS! Code pushed to GitHub
    echo ============================================
    echo.
    echo Repository: https://github.com/ali123raza/miner3
    echo Branch: main
    echo.
    echo You can view your code at:
    echo https://github.com/ali123raza/miner3
    echo.
) else (
    echo.
    echo ============================================
    echo PUSH FAILED!
    echo ============================================
    echo.
    echo Common issues:
    echo 1. Wrong username or token
    echo 2. Token doesn't have "repo" scope
    echo 3. Repository doesn't exist or access denied
    echo.
    echo Please check your credentials and try again.
    echo.
)

pause
