# TWA Deployment Checklist

Use this checklist to ensure everything is set up correctly before building your Android app.

---

## Phase 1: Web-Side Preparation

### Files Created ✓
- [x] `public/manifest.json` - PWA manifest
- [x] `public/sw.js` - Service Worker
- [x] `public/offline.html` - Offline fallback page
- [x] `public/.well-known/assetlinks.json` - Digital Asset Links
- [x] `src/services/serviceWorker.js` - Service Worker helper
- [x] Service Worker registered in `src/main.jsx`
- [x] Manifest linked in `index.html`

### Icons Required
- [ ] `public/icons/icon-72x72.png`
- [ ] `public/icons/icon-96x96.png`
- [ ] `public/icons/icon-128x128.png`
- [ ] `public/icons/icon-144x144.png`
- [ ] `public/icons/icon-152x152.png`
- [ ] `public/icons/icon-192x192.png`
- [ ] `public/icons/icon-384x384.png`
- [ ] `public/icons/icon-512x512.png`

**How to generate:** See `public/icons/README.md`

---

## Phase 2: Build & Deploy Website

### Build Production Version
```bash
npm run build
```

### Files to Deploy
Deploy your `dist/` folder with these additional files:

```
yourdomain.com/
  ├── index.html
  ├── assets/
  ├── manifest.json         ← Deploy this
  ├── offline.html          ← Deploy this
  ├── sw.js                 ← Deploy this
  ├── icons/                ← Deploy all icons
  │   ├── icon-72x72.png
  │   ├── icon-96x96.png
  │   └── ... (all 8)
  └── .well-known/          ← Deploy this directory
      └── assetlinks.json
```

### Verification Tests
After deployment, check these URLs (replace with your domain):

- [ ] `https://yourdomain.com/manifest.json` → Returns JSON (no 404)
- [ ] `https://yourdomain.com/sw.js` → Returns JavaScript (no 404)
- [ ] `https://yourdomain.com/offline.html` → Shows offline page
- [ ] `https://yourdomain.com/icons/icon-512x512.png` → Shows icon
- [ ] `https://yourdomain.com/.well-known/assetlinks.json` → Returns JSON (no 404)

**Test in Browser:**
1. Open `https://yourdomain.com` in Chrome
2. Open DevTools (F12)
3. Go to **Application** tab
4. Check **Manifest** section → All icons should load
5. Check **Service Workers** section → Should show "activated and running"

---

## Phase 3: Create Android App

### Install Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Initialize TWA Project
```bash
# Create directory
mkdir cloudminer-twa
cd cloudminer-twa

# Initialize (REPLACE yourdomain.com with your actual domain!)
bubblewrap init --manifest=https://yourdomain.com/manifest.json
```

### Configuration Values
During initialization, enter:

| Prompt | Value | Notes |
|--------|-------|-------|
| Package ID | `com.cloudminer.app` | Use your own package name |
| App name | `CloudMiner` | Your app name |
| Display mode | `standalone` | Accept default |
| Orientation | `portrait` | Accept default |
| Theme color | `#1a1f2e` | From manifest.json |
| Start URL | `/` | Accept default |
| Create keystore? | `Y` | For signing APK |
| Keystore password | (your password) | **SAVE THIS!** |
| Key alias | `cloudminer-key` | Any name |

**IMPORTANT:** Backup `android.keystore` immediately! Without it, you cannot update your Play Store app.

### Build APK
```bash
bubblewrap build
```

**Output files:**
- `app-release-signed.apk` → Test on phone
- `app-release-bundle.aab` → Upload to Play Store

---

## Phase 4: Digital Asset Links

### Get SHA-256 Fingerprint
```bash
cd cloudminer-twa
keytool -list -v -keystore android.keystore -alias cloudminer-key
```

Copy the **SHA256** line (looks like: `AA:BB:CC:DD:EE:FF:...`)

### Update assetlinks.json

Edit `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cloudminer.app",
      "sha256_cert_fingerprints": [
        "PASTE_SHA256_HERE_WITHOUT_COLONS"
      ]
    }
  }
]
```

**Remove colons from fingerprint!**

Example:
- ✅ Correct: `AABBCCDDEEFF001122334455667788...`
- ❌ Wrong: `AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:...`

### Redeploy Website
Deploy updated `assetlinks.json` to production.

### Verify Digital Asset Links
Wait 5-10 minutes, then test:

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls
```

Expected response should include:
```json
{
  "statements": [
    {
      "source": { "web": { "site": "https://yourdomain.com" } },
      "target": {
        "androidApp": {
          "packageName": "com.cloudminer.app",
          "certificate": { "sha256Fingerprint": "AA:BB:CC:..." }
        }
      }
    }
  ]
}
```

---

## Phase 5: Google OAuth Configuration

### Get SHA-1 Fingerprint
```bash
cd cloudminer-twa
keytool -list -v -keystore android.keystore -alias cloudminer-key | grep SHA1
```

Copy the **SHA1** line (keep the colons this time!).

### Create Android OAuth Client

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project (same project as your website OAuth)
3. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Choose **Android**
5. Fill in:
   - **Name:** `CloudMiner Android App`
   - **Package name:** `com.cloudminer.app`
   - **SHA-1 certificate fingerprint:** (paste from above, with colons)
6. Click **CREATE**

### Verify OAuth Setup

- [ ] Android OAuth client created
- [ ] Package name matches TWA package
- [ ] SHA-1 fingerprint added
- [ ] Web OAuth client still exists (don't delete it!)
- [ ] Authorized JavaScript origins include: `https://yourdomain.com`
- [ ] Authorized redirect URIs include your callback URLs

---

## Phase 6: Testing

### Install APK on Phone

**Method 1: USB Debugging**
```bash
# Enable USB debugging on phone: Settings → Developer Options → USB Debugging
# Connect phone to computer

cd cloudminer-twa
adb install app-release-signed.apk
```

**Method 2: Direct Install**
1. Copy `app-release-signed.apk` to your phone
2. Open the file on phone
3. Allow installation from unknown sources
4. Tap "Install"

### Functionality Tests

- [ ] **App launches** → Opens in fullscreen (no address bar)
- [ ] **Splash screen** → Shows your icon briefly
- [ ] **Home page loads** → Website content appears
- [ ] **Google OAuth** → Tap "Sign in with Google"
  - [ ] Chrome Custom Tab opens (not full browser)
  - [ ] Google login page appears
  - [ ] Can log in successfully
  - [ ] Redirected back to app after login
  - [ ] User profile displays correctly
  - [ ] No "disallowed_useragent" error
- [ ] **Session persistence** → Close app, reopen → Still logged in
- [ ] **Offline mode** → Enable Airplane Mode → Shows offline page
- [ ] **Reconnection** → Disable Airplane Mode → App reconnects
- [ ] **Navigation** → All pages work correctly
- [ ] **Back button** → Works as expected
- [ ] **External links** → Open in Chrome browser (not in app)

### Visual Tests

- [ ] Status bar color matches theme (`#1a1f2e`)
- [ ] App icon shows on home screen
- [ ] No browser UI visible (no address bar, no Chrome buttons)
- [ ] Splash screen uses correct colors
- [ ] All images and icons load

### Performance Tests

- [ ] App loads within 3 seconds on 4G
- [ ] Smooth navigation (no lag)
- [ ] No JavaScript errors in console

---

## Phase 7: Play Store Preparation (Optional)

### Build App Bundle
```bash
cd cloudminer-twa
bubblewrap build
```

File: `app-release-bundle.aab`

### Required Assets

- [ ] App icon: 512×512 PNG (already have from icons)
- [ ] Feature graphic: 1024×500 PNG (create in Canva/Figma)
- [ ] Screenshots: At least 2 (take from phone)
- [ ] Privacy Policy URL (host on your website)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)

### Play Store Listing Info

**Example Short Description:**
```
Professional crypto mining platform - secure, profitable, transparent.
```

**Example Full Description:**
```
CloudMiner is a professional cryptocurrency mining and investment platform that brings transparency and security to digital asset management.

Features:
• Real-time mining statistics and analytics
• Secure wallet management
• Multiple cryptocurrency support
• Detailed portfolio tracking
• 24/7 customer support

Start mining today with CloudMiner!
```

**Category:** Finance or Tools

**Content Rating:** Complete questionnaire based on your app content

### Pre-Launch Checklist

- [ ] AAB file ready (`app-release-bundle.aab`)
- [ ] Privacy Policy published at public URL
- [ ] Terms of Service published (recommended)
- [ ] Feature graphic created (1024×500)
- [ ] Screenshots taken (at least 2)
- [ ] App description written
- [ ] Content rating completed
- [ ] Target age set appropriately
- [ ] Countries/regions selected for distribution

### Submit to Play Store

1. Go to: https://play.google.com/console
2. Click **Create app**
3. Fill in app details
4. Upload AAB file
5. Complete all required sections:
   - Store listing
   - Content rating
   - Pricing & distribution
   - App content (privacy policy, etc.)
6. Create **Internal testing** track first (test with friends)
7. After testing, promote to **Production**
8. Submit for review

**Review time:** 1-7 days (usually 2-3 days)

---

## Phase 8: Post-Launch

### Monitor App Performance

- [ ] Check Play Console for crash reports
- [ ] Monitor user reviews and ratings
- [ ] Track installation metrics
- [ ] Check for pre-launch report issues

### Update App (When Needed)

1. Update your website
2. Test website changes
3. Increment version in `twa-manifest.json`:
   ```json
   {
     "appVersionName": "1.0.1",
     "appVersionCode": 2
   }
   ```
4. Rebuild:
   ```bash
   cd cloudminer-twa
   bubblewrap build
   ```
5. Upload new AAB to Play Store
6. Submit for review

**Important:** Always increment `appVersionCode` (integer) with each release.

---

## Troubleshooting Checklist

### If Address Bar Shows

- [ ] Wait 10 minutes (Digital Asset Links take time to propagate)
- [ ] Verify `assetlinks.json` is accessible via browser
- [ ] Verify SHA-256 fingerprint matches (no typos)
- [ ] Package name matches in all locations
- [ ] Clear app data: Settings → Apps → CloudMiner → Storage → Clear Data
- [ ] Reinstall app

### If OAuth Fails

- [ ] Android OAuth client exists in Google Cloud Console
- [ ] SHA-1 fingerprint is correct (with colons)
- [ ] Package name matches
- [ ] Wait 5 minutes after creating OAuth client
- [ ] Check JavaScript console for errors

### If Icons Don't Load

- [ ] Icons deployed to production
- [ ] Icon URLs use absolute paths: `https://yourdomain.com/icons/...`
- [ ] Test icon URLs in browser (should load)
- [ ] Check manifest.json syntax (valid JSON)

### If Service Worker Fails

- [ ] Website uses HTTPS (required for service workers)
- [ ] `sw.js` is in root directory
- [ ] Check Chrome DevTools → Application → Service Workers
- [ ] Check for JavaScript errors in console

---

## Success Criteria

Your TWA is ready when ALL of these are true:

- ✅ App installs on Android device
- ✅ Opens in fullscreen (no address bar)
- ✅ Google OAuth works without errors
- ✅ Session persists after closing app
- ✅ Offline page shows when no internet
- ✅ App icon shows correctly on home screen
- ✅ No JavaScript errors in console
- ✅ All website features work in app
- ✅ Digital Asset Links verified

---

## Timeline Summary

| Phase | Time Required | Can Skip? |
|-------|---------------|-----------|
| 1. Web prep | ✅ Done | No |
| 2. Deploy website | 5 min | No |
| 3. Create Android app | 5 min | No |
| 4. Digital Asset Links | 10 min | No |
| 5. Google OAuth | 5 min | No |
| 6. Testing | 15 min | No |
| 7. Play Store prep | 30 min | Yes (for testing) |
| 8. Post-launch | Ongoing | N/A |

**Minimum time to working APK:** ~40-50 minutes

---

## Support Resources

- **Full guide:** `TWA_IMPLEMENTATION_GUIDE.md`
- **Quick start:** `TWA_QUICK_START.md`
- **Icon guide:** `public/icons/README.md`
- **Bubblewrap docs:** https://github.com/GoogleChromeLabs/bubblewrap
- **TWA guide:** https://developer.chrome.com/docs/android/trusted-web-activity/
- **Digital Asset Links:** https://developers.google.com/digital-asset-links

---

## Notes

- Keep `android.keystore` backed up in multiple secure locations
- Save all passwords in a password manager
- Test on multiple Android devices if possible
- Start with internal testing before public release
- Update app regularly to match website updates

---

**Last Updated:** Generated on setup

**Status:** Ready for implementation

Good luck! 🚀
