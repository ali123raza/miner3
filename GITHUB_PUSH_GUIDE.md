# GitHub Push Guide - CloudMiner

## Current Status

- ✅ Git repository initialized
- ✅ Remote added: https://github.com/ali123raza/miner3.git
- ✅ Branch renamed to main
- ⚠️ Authentication needed to push

## Authentication Required

The repository requires authentication because the stored credentials are for a different user (bbbilalbbbilal61-hash) but you need to push to ali123raza's repository.

## Method 1: Use the Push Script (Easiest)

Simply run:
```bash
push-to-github.bat
```

This script will:
1. Prompt for your GitHub username
2. Prompt for your Personal Access Token
3. Push the code to GitHub

## Method 2: Manual Push with Token

### Step 1: Generate Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `miner3-push`
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Push with Token

Replace `YOUR_TOKEN` with your actual token:

```bash
git push https://YOUR_TOKEN@github.com/ali123raza/miner3.git main
```

Or with username:
```bash
git push https://ali123raza:YOUR_TOKEN@github.com/ali123raza/miner3.git main
```

### Step 3: Set Upstream (After First Push)

```bash
git branch --set-upstream-to=origin/main main
```

## Method 3: Use Git Credential Manager (Windows)

Git Credential Manager will open a browser window for authentication:

```bash
git push -u origin main
```

This will:
1. Open your browser
2. Ask you to sign in to GitHub
3. Store credentials securely
4. Push your code

## Method 4: SSH Authentication (More Secure)

### Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept defaults.

### Step 2: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   type %USERPROFILE%\.ssh\id_ed25519.pub
   ```

2. Go to: https://github.com/settings/ssh/new
3. Paste the key
4. Click "Add SSH key"

### Step 3: Change Remote to SSH

```bash
git remote set-url origin git@github.com:ali123raza/miner3.git
```

### Step 4: Push

```bash
git push -u origin main
```

## What Gets Pushed

All your project files including:
- ✅ Source code (src/)
- ✅ API backend (api/)
- ✅ Public assets (public/)
- ✅ TWA project (cloudminer-twa/)
- ✅ Configuration files
- ✅ Documentation

**Note:** Large files and sensitive files in `.gitignore` won't be pushed.

## After Successful Push

You can view your repository at:
```
https://github.com/ali123raza/miner3
```

## Troubleshooting

### Error: Permission Denied (403)
- **Cause:** Wrong credentials
- **Fix:** Generate a new token with "repo" scope

### Error: Repository not found (404)
- **Cause:** Repository doesn't exist or wrong URL
- **Fix:** Create repository at https://github.com/new

### Error: Authentication failed
- **Cause:** Token expired or invalid
- **Fix:** Generate new token and try again

### Push is taking very long
- **Cause:** Large file upload
- **Normal:** First push uploads all files (can take 5-10 minutes)

## Verifying Your Push

After pushing, verify at:
1. Go to: https://github.com/ali123raza/miner3
2. Check if your files are there
3. Check the commit history
4. Verify all folders are present

## Future Pushes

After the first successful push, you can simply use:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Need Help?

1. Make sure you have the correct repository access
2. Verify your GitHub username is "ali123raza"
3. Use a Personal Access Token with "repo" scope
4. Or run `push-to-github.bat` for guided setup

---

**Quick Command:**
```bash
push-to-github.bat
```

This will handle everything for you!
