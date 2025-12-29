# TWA Quick Start Guide
## Get Your Android APK in 30 Minutes

This is a simplified guide to get you started quickly. For complete details, see `TWA_IMPLEMENTATION_GUIDE.md`.

---

## ✅ What's Already Done

Your web app now has:
- ✅ `manifest.json` (PWA manifest)
- ✅ Service Worker for offline support
- ✅ Digital Asset Links template
- ✅ Offline fallback page

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Generate App Icons (15-30 min)

You need 8 PNG icons. **Choose one method:**

**Option A: Use Online Tool** (Easiest)
1. Create a 1024×1024 logo
2. Go to: https://www.pwabuilder.com/imageGenerator
3. Upload your logo
4. Download generated icons
5. Copy all files to `public/icons/`

**Option B: Use NPM Tool** (Fastest)
```bash
# Install tool
npm install -g pwa-asset-generator

# Generate icons (replace path to your logo)
pwa-asset-generator public/logo.svg public/icons --background "#1a1f2e" --padding "20%"
```

**Option C: Manual Export**
Export these sizes from Figma/Photoshop:
- 72×72, 96×96, 128×128, 144×144, 152×152, 192×192, 384×384, 512×512

Save as: `icon-{SIZE}.png` in `public/icons/`

---

### Step 2: Deploy to Production (5 min)

Deploy your website with these new files:

```
yourdomain.com/
  ├── manifest.json
  ├── offline.html
  ├── sw.js
  ├── icons/
  │   ├── icon-72x72.png
  │   ├── icon-96x96.png
  │   └── ... (all 8 icons)
  └── .well-known/
      └── assetlinks.json
```

**Verify deployment:**
1. Visit: `https://yourdomain.com/manifest.json`
2. Visit: `https://yourdomain.com/icons/icon-512x512.png`
3. Visit: `https://yourdomain.com/.well-known/assetlinks.json`

All should load successfully (no 404 errors).

---

### Step 3: Create Android App with Bubblewrap (5 min)

**Option A: Use Setup Script** (Windows)
```bash
# Run the automated setup script
twa-setup.bat
```

**Option B: Manual Setup** (All platforms)
```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Create new directory for Android app
mkdir cloudminer-twa
cd cloudminer-twa

# Initialize (replace yourdomain.com with your actual domain)
bubblewrap init --manifest=https://yourdomain.com/manifest.json

# Follow the prompts:
# - Package ID: com.cloudminer.app
# - App name: CloudMiner
# - Accept defaults for other options

# Build APK
bubblewrap build
```

This creates:
- `android.keystore` (BACKUP THIS FILE!)
- `app-release-signed.apk` (install on phone)
- `app-release-bundle.aab` (upload to Play Store)

---

### Step 4: Link Your Android App (5 min)

Get your app's SHA-256 fingerprint:

```bash
cd cloudminer-twa
keytool -list -v -keystore android.keystore -alias cloudminer-key
```

Copy the SHA-256 line (looks like: `AA:BB:CC:DD:...`).

Remove colons: `AABBCCDD...`

Update `public/.well-known/assetlinks.json`:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cloudminer.app",
      "sha256_cert_fingerprints": [
        "PASTE_YOUR_SHA256_HERE_WITHOUT_COLONS"
      ]
    }
  }
]
```

**Redeploy** your website with updated `assetlinks.json`.

**Verify** after 5 minutes:
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls
```

Should show your app's package name and fingerprint.

---

### Step 5: Configure Google OAuth (5 min)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Choose **Android**
5. Fill in:
   - **Name:** CloudMiner Android App
   - **Package name:** `com.cloudminer.app`
   - **SHA-1 fingerprint:** Get it from:
     ```bash
     keytool -list -v -keystore android.keystore -alias cloudminer-key | grep SHA1
     ```
     (Copy the SHA1 line, including colons)
6. Click **CREATE**

That's it! Your Google OAuth will now work in the Android app.

---

## 📱 Testing Your App

### Install on Phone

**Method 1: USB Cable**
```bash
# Enable USB debugging on phone
# Connect phone to computer

cd cloudminer-twa
adb install app-release-signed.apk
```

**Method 2: Transfer APK**
1. Copy `app-release-signed.apk` to your phone
2. Open the file on your phone
3. Allow installation from unknown sources
4. Install

### Test Checklist

Open the app and verify:

- [ ] App opens in fullscreen (no address bar)
- [ ] Tap "Sign in with Google"
- [ ] Chrome Custom Tab opens (shows Google login)
- [ ] Log in successfully
- [ ] Redirected back to app (logged in)
- [ ] Close app and reopen → still logged in
- [ ] Enable Airplane Mode → shows offline page
- [ ] Disable Airplane Mode → app reconnects

If the address bar is visible:
1. Wait 5-10 minutes for Digital Asset Links to propagate
2. Clear app data: Settings → Apps → CloudMiner → Storage → Clear Data
3. Reinstall app

---

## 🎯 Next Steps

### For Testing (Internal)
Your APK is ready! Share with friends for testing.

### For Play Store Release

1. Build AAB (Android App Bundle):
   ```bash
   cd cloudminer-twa
   bubblewrap build
   ```
   File: `app-release-bundle.aab`

2. Create Play Store listing:
   - Go to: https://play.google.com/console
   - Create new app
   - Upload AAB
   - Add screenshots, description, privacy policy
   - Submit for review

3. Play Store Requirements:
   - Privacy Policy URL (required)
   - App icon 512×512 (already have it)
   - Feature graphic 1024×500 (create in Canva)
   - At least 2 screenshots (take from phone)
   - Content rating (complete questionnaire)

**Review time:** 1-7 days

---

## 🔧 Common Issues

### "Address bar still shows"
- **Cause:** Digital Asset Links not verified
- **Fix:**
  1. Verify `assetlinks.json` is accessible
  2. SHA-256 matches keystore
  3. Wait 10 minutes, clear app data, reinstall

### "Google OAuth blocked"
- **Cause:** Android OAuth client not configured
- **Fix:** Add Android OAuth client with SHA-1 fingerprint

### "Icons don't load"
- **Cause:** Icons not deployed or wrong paths
- **Fix:** Use absolute URLs in manifest: `https://yourdomain.com/icons/...`

### "App crashes"
- **Cause:** Website not accessible or invalid manifest
- **Fix:** Test website in Chrome mobile browser first

---

## 📚 Full Documentation

For complete details, troubleshooting, and advanced features:
- Read: `TWA_IMPLEMENTATION_GUIDE.md`
- Icon guide: `public/icons/README.md`

---

## ⏱️ Time Estimate

- **Icons:** 15-30 minutes
- **Deployment:** 5 minutes
- **Bubblewrap setup:** 5 minutes
- **Digital Asset Links:** 5 minutes
- **Google OAuth:** 5 minutes
- **Testing:** 10 minutes

**Total: ~45-60 minutes** (first time)

Updates take only 5 minutes (just rebuild and reinstall).

---

## 🎉 You're Done!

Your web app is now a native Android app that:
- ✅ Looks like a real native app (fullscreen)
- ✅ Works with Google OAuth (no WebView issues)
- ✅ Installs like a native app
- ✅ Works offline
- ✅ Can be published to Google Play Store

**Need help?** See `TWA_IMPLEMENTATION_GUIDE.md` or open an issue.
