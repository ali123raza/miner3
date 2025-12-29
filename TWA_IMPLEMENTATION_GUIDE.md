# Complete TWA Implementation Guide
## Convert Your Web App to Android APK with Google OAuth Support

**Project:** CloudMiner - Crypto Mining & Investment Platform
**Frontend:** React (Vite) + Tailwind CSS
**Backend:** PHP API
**Authentication:** Google OAuth
**Target:** Production-ready Android APK using Trusted Web Activity (TWA)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [A) Web-Side Preparation](#a-web-side-preparation)
3. [B) Digital Asset Links](#b-digital-asset-links)
4. [C) Android App Creation (TWA)](#c-android-app-creation-twa)
5. [D) Google OAuth Compatibility](#d-google-oauth-compatibility)
6. [E) UX & Behavior](#e-ux--behavior)
7. [F) Testing Checklist](#f-testing-checklist)
8. [G) Optional Enhancements](#g-optional-enhancements)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Tools Required
- **Node.js 18+** (already installed)
- **npm/npx** (already installed)
- **Java JDK 17+** (for Android builds)
- **Android SDK** (will be installed by Bubblewrap)
- **Production domain with HTTPS** (e.g., `yourdomain.com`)

### What You Already Have ✓
- React web app with mobile-first design
- PHP backend API
- Google OAuth working on website
- HTTPS enabled on production domain

---

## A) Web-Side Preparation

### 1. Create `manifest.json` (PWA Manifest)

Create a file at `public/manifest.json`:

```json
{
  "name": "CloudMiner - Crypto Mining Platform",
  "short_name": "CloudMiner",
  "description": "Professional Crypto Mining & Investment Platform",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1a1f2e",
  "background_color": "#1a1f2e",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Key Fields Explained:**
- `start_url`: The URL that opens when the app launches (usually `/`)
- `display: "standalone"`: Hides browser UI (fullscreen app experience)
- `theme_color`: Status bar color on Android
- `background_color`: Splash screen background color
- `scope`: Limits app to your domain (prevents opening external links in app)

---

### 2. Link Manifest in `index.html`

Update your `index.html` (line 6-7):

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1a1f2e">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- ... rest of your head tags -->
</head>
```

---

### 3. Prepare App Icons

**Required Icon Sizes:**
TWA/PWA requires specific icon sizes. Create PNG icons:

| Size | Usage |
|------|-------|
| 72x72 | mdpi (1x) |
| 96x96 | hdpi (1.5x) |
| 128x128 | xhdpi (2x) |
| 144x144 | xxhdpi (3x) |
| 152x152 | iPad |
| 192x192 | xxxhdpi (4x) |
| 384x384 | High-res |
| 512x512 | Splash screen, Play Store |

**Directory Structure:**
```
public/
  ├── manifest.json
  └── icons/
      ├── icon-72x72.png
      ├── icon-96x96.png
      ├── icon-128x128.png
      ├── icon-144x144.png
      ├── icon-152x152.png
      ├── icon-192x192.png
      ├── icon-384x384.png
      └── icon-512x512.png
```

**Icon Requirements:**
- **Format:** PNG (no transparency recommended)
- **Background:** Solid color (use your brand color)
- **Content:** Center your logo with padding (20% margin)
- **Style:** Modern, simple, recognizable at small sizes
- **Maskable:** Android may crop icons into different shapes (circle, rounded square)

**Quick Icon Generation Options:**
1. **Online Tool:** Use [pwa-asset-generator](https://www.npmjs.com/package/pwa-asset-generator)
   ```bash
   npx pwa-asset-generator public/logo.svg public/icons --background "#1a1f2e"
   ```
2. **Figma/Photoshop:** Export at each size manually
3. **ImageMagick:** Resize from a single 1024x1024 source
   ```bash
   convert logo-1024.png -resize 72x72 icon-72x72.png
   convert logo-1024.png -resize 96x96 icon-96x96.png
   # ... repeat for each size
   ```

---

### 4. HTTPS & PWA Checklist

Before proceeding, verify your production website:

- [ ] **HTTPS enabled** (required for TWA and service workers)
- [ ] **Valid SSL certificate** (not self-signed)
- [ ] **Service Worker** (optional but recommended for offline support)
- [ ] **Manifest accessible** at `https://yourdomain.com/manifest.json`
- [ ] **Icons accessible** at `https://yourdomain.com/icons/icon-*.png`

**Test Your Manifest:**
1. Open Chrome on desktop
2. Navigate to your production site
3. Open DevTools → Application → Manifest
4. Verify all icons load and manifest is valid

---

## B) Digital Asset Links

Digital Asset Links prove that you own both the website and the Android app. This enables TWA to run in fullscreen without browser UI.

### 1. Generate SHA-256 Fingerprint

You need the SHA-256 fingerprint of your app signing key. You'll get this **after** building your app with Bubblewrap (see section C), but here's how:

**For Debug Key (Testing):**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**For Release Key (Production):**
```bash
keytool -list -v -keystore /path/to/your-release-key.keystore -alias your-key-alias
```

Look for the line:
```
SHA256: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99
```

**Important:** Remove the colons for the `assetlinks.json` file:
```
AABBCCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899
```

---

### 2. Create `assetlinks.json`

Create a file at the **root of your public web directory**:

**File Path:** `public/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cloudminer.app",
      "sha256_cert_fingerprints": [
        "AABBCCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899"
      ]
    }
  }
]
```

**Replace:**
- `com.cloudminer.app` → Your actual Android package name (from Bubblewrap initialization)
- `AABBCC...` → Your actual SHA-256 fingerprint (without colons)

**For Multiple Build Types (Debug + Release):**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cloudminer.app",
      "sha256_cert_fingerprints": [
        "DEBUG_SHA256_FINGERPRINT_HERE",
        "RELEASE_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

---

### 3. Host `assetlinks.json`

**Server Configuration:**

The file **must** be accessible at:
```
https://yourdomain.com/.well-known/assetlinks.json
```

**Apache `.htaccess` (if needed):**
```apache
<Files "assetlinks.json">
  Header set Content-Type "application/json"
  Header set Access-Control-Allow-Origin "*"
</Files>
```

**Nginx (if needed):**
```nginx
location /.well-known/assetlinks.json {
    default_type application/json;
    add_header Access-Control-Allow-Origin *;
}
```

**PHP Router (if you're using a single-page app router):**
Ensure your `router.php` or `.htaccess` doesn't block `.well-known/` directory.

**Verify Hosting:**
```bash
curl -I https://yourdomain.com/.well-known/assetlinks.json
```

Expected response:
```
HTTP/2 200
Content-Type: application/json
```

---

### 4. Verify Digital Asset Links

**Google's Official Verification Tool:**
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls

**Expected Response:**
```json
{
  "statements": [
    {
      "source": {
        "web": {
          "site": "https://yourdomain.com"
        }
      },
      "relation": "delegate_permission/common.handle_all_urls",
      "target": {
        "androidApp": {
          "packageName": "com.cloudminer.app",
          "certificate": {
            "sha256Fingerprint": "AA:BB:CC:..."
          }
        }
      }
    }
  ]
}
```

**Common Verification Mistakes:**

| Issue | Solution |
|-------|----------|
| 404 Not Found | Ensure `.well-known` directory exists and is publicly accessible |
| Wrong MIME type | Set `Content-Type: application/json` header |
| SHA-256 mismatch | Regenerate fingerprint and verify no typos |
| Package name mismatch | Use exact package name from Android app |
| HTTPS not working | Fix SSL certificate before proceeding |
| Cached old version | Clear CDN/server cache, wait 5-10 minutes |

---

## C) Android App Creation (TWA)

We'll use **Bubblewrap CLI** to generate a production-ready Android app that wraps your website.

### 1. Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

**Verify Installation:**
```bash
bubblewrap --version
```

---

### 2. Initialize TWA Project

Navigate to a **new directory** (outside your web app):

```bash
cd E:\android-projects
mkdir cloudminer-twa
cd cloudminer-twa
```

**Initialize Bubblewrap:**
```bash
bubblewrap init --manifest=https://yourdomain.com/manifest.json
```

**Interactive Prompts:**

| Prompt | Value | Example |
|--------|-------|---------|
| Package ID | Reverse domain format | `com.cloudminer.app` |
| App name | Your app name | `CloudMiner` |
| Display mode | standalone (default) | `standalone` |
| Orientation | portrait (default) | `portrait` |
| Theme color | Hex color from manifest | `#1a1f2e` |
| Background color | Hex color from manifest | `#1a1f2e` |
| Start URL | Root path | `/` |
| Icon URL | Path to 512x512 icon | `https://yourdomain.com/icons/icon-512x512.png` |
| Maskable icon | Same as icon | `https://yourdomain.com/icons/icon-512x512.png` |
| Splash screen | Use icon | Yes |
| Fallback | Enable Chrome fallback | Yes |

**What This Creates:**
```
cloudminer-twa/
  ├── twa-manifest.json    # Bubblewrap configuration
  ├── android/             # Android project files
  ├── store_icon.png       # Downloaded app icon
  └── splash.png           # Splash screen image
```

---

### 3. Configure `twa-manifest.json`

Open `twa-manifest.json` and verify/adjust:

```json
{
  "packageId": "com.cloudminer.app",
  "host": "yourdomain.com",
  "name": "CloudMiner",
  "launcherName": "CloudMiner",
  "display": "standalone",
  "orientation": "portrait",
  "themeColor": "#1a1f2e",
  "backgroundColor": "#1a1f2e",
  "startUrl": "/",
  "iconUrl": "https://yourdomain.com/icons/icon-512x512.png",
  "maskableIconUrl": "https://yourdomain.com/icons/icon-512x512.png",
  "splashScreenFadeOutDuration": 300,
  "enableNotifications": false,
  "isChromeOSOnly": false,
  "enableSiteSettingsShortcut": true,
  "signingKey": {
    "path": "./android.keystore",
    "alias": "cloudminer-key"
  },
  "appVersionName": "1.0.0",
  "appVersionCode": 1,
  "shortcuts": [],
  "generatorApp": "bubblewrap-cli",
  "webManifestUrl": "https://yourdomain.com/manifest.json",
  "fallbackType": "customtabs",
  "features": {
    "locationDelegation": {
      "enabled": false
    },
    "playBilling": {
      "enabled": false
    }
  },
  "alphaDependencies": {
    "enabled": false
  },
  "minSdkVersion": 21,
  "targetSdkVersion": 33
}
```

**Key Configuration Options:**

- `packageId`: **Must match** the package name in `assetlinks.json`
- `host`: Your production domain (no `https://`, no trailing slash)
- `startUrl`: The path users see on app launch
- `enableNotifications`: Set to `true` if you want web push notifications
- `fallbackType`: `"customtabs"` uses Chrome Custom Tabs if TWA fails
- `minSdkVersion`: 21 = Android 5.0+ (covers 99% of devices)
- `targetSdkVersion`: 33 = Android 13 (use latest stable)

---

### 4. Generate Signing Key (First Time Only)

For production releases, you need a signing key:

```bash
bubblewrap build
```

**Bubblewrap will prompt you to create a keystore:**

```
No signing key found. Would you like to create one? (Y/n)
```

Type `Y` and enter:
- **Keystore password:** (remember this!)
- **Key alias:** `cloudminer-key` (or any name)
- **Key password:** (can be same as keystore password)
- **Validity:** `10000` days (about 27 years)

**Save Your Keystore:**
- File location: `./android.keystore`
- **Backup this file immediately!** (If you lose it, you can't update your Play Store app)
- Store passwords in a secure password manager

---

### 5. Build APK (Debug)

```bash
bubblewrap build
```

**Output:**
```
cloudminer-twa/
  └── app-release-unsigned.apk    # Unsigned APK
  └── app-release-signed.apk      # Signed APK (ready for testing)
```

**Install on Device (USB Debugging):**
```bash
adb install app-release-signed.apk
```

Or transfer the APK to your phone and install manually.

---

### 6. Build AAB (Play Store Release)

For Google Play Store submission, build an **Android App Bundle (AAB)**:

```bash
bubblewrap build --skipPwaValidation
```

**Output:**
```
cloudminer-twa/
  └── app-release-bundle.aab    # Ready for Play Store upload
```

**Why AAB instead of APK?**
- Google Play requires AAB format (since August 2021)
- Smaller download sizes (Google optimizes per device)
- Supports dynamic delivery and instant apps

---

### 7. Update App (Future Releases)

When you update your website or want to release a new version:

```bash
# Update version numbers in twa-manifest.json
"appVersionName": "1.0.1",
"appVersionCode": 2

# Rebuild
bubblewrap build
```

**Important:** Increment `appVersionCode` with **every** Play Store update (even minor changes).

---

### 8. Splash Screen & App Icon Setup

**Splash Screen:**
Bubblewrap automatically generates a splash screen from your icon. To customize:

1. Edit `android/app/src/main/res/values/styles.xml`
2. Modify `LauncherTheme` background color
3. Replace `android/app/src/main/res/drawable/splash.png` with custom splash

**App Icon:**
Bubblewrap downloads your icon from `iconUrl` in the manifest. To update:

```bash
bubblewrap update
```

Or manually replace icons in:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

---

## D) Google OAuth Compatibility

### Why WebView Breaks Google OAuth

**The Problem:**
Google blocks OAuth in embedded WebViews for security reasons:
- OAuth error: `disallowed_useragent`
- Error message: "This browser or app may not be secure"

**Why TWA Works:**
TWA uses **Chrome Custom Tabs** (a real Chrome browser instance), not a WebView. Google allows OAuth in real browsers.

**Key Difference:**

| Technology | Browser Engine | Google OAuth |
|------------|---------------|--------------|
| WebView | Embedded, restricted | ❌ Blocked |
| TWA (Trusted Web Activity) | Full Chrome browser | ✅ Allowed |
| Chrome Custom Tabs | Full Chrome browser | ✅ Allowed |

---

### Google Cloud Console Configuration

You already have Google OAuth working on your website. Now add Android app support:

#### Step 1: Open Google Cloud Console
https://console.cloud.google.com/apis/credentials

#### Step 2: Select Your Project
Choose the project with your existing OAuth credentials.

#### Step 3: Add Android App to OAuth Client

**Option A: Edit Existing Web Client**
1. Click your existing OAuth 2.0 Client ID
2. Under **Authorized JavaScript origins**, verify:
   ```
   https://yourdomain.com
   ```
3. Under **Authorized redirect URIs**, verify:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/auth/google/callback
   https://yourdomain.com
   ```

**Option B: Create Android OAuth Client (Recommended for TWA)**
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Android**
3. Name: `CloudMiner Android App`
4. Package name: `com.cloudminer.app` (must match your TWA package)
5. SHA-1 certificate fingerprint:
   ```bash
   # For debug builds
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1

   # For release builds
   keytool -list -v -keystore ./android.keystore -alias cloudminer-key | grep SHA1
   ```
   Example output: `A1:B2:C3:D4:E5:F6:...`

6. Click **CREATE**

---

### What NOT to Configure

**Do NOT create these:**
- ❌ **iOS OAuth Client** (unless you're building iOS app)
- ❌ **Desktop OAuth Client** (unless you have a desktop app)
- ❌ **Chrome Extension OAuth Client** (unless you have an extension)

**Do NOT change these:**
- ❌ **Existing Web Client credentials** (your website OAuth already works)
- ❌ **API Keys** (unless Google tells you to)
- ❌ **Service Account Keys** (different use case)

---

### JavaScript Origin Rules

**Authorized JavaScript Origins:**
These are the domains allowed to initiate OAuth:

```
https://yourdomain.com
```

**Do NOT add:**
- `http://yourdomain.com` (use HTTPS only)
- `https://www.yourdomain.com` (unless you use www subdomain)
- `com.cloudminer.app` (not a valid origin)
- `intent://` or `android://` (Android apps use package-based auth)

---

### Redirect URI Rules

**Authorized Redirect URIs:**
Where Google sends users after authentication:

```
https://yourdomain.com/auth/callback
https://yourdomain.com/auth/google/callback
https://yourdomain.com
```

**Format Rules:**
- Must use HTTPS (except localhost)
- No wildcards allowed
- No query parameters
- No fragments (#)
- Must match **exactly** what your app sends

**Check Your App Code:**
Find where you initialize Google OAuth (likely in `src/auth/` or `src/services/`):

```javascript
// Example (React)
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourdomain.com/auth/google/callback&
  response_type=code&
  scope=email profile`;
```

The `redirect_uri` must be in your OAuth Client's allowed list.

---

### Testing OAuth in TWA

**Flow Overview:**
1. User taps "Sign in with Google" in your Android app
2. TWA opens Google's OAuth page **in Chrome Custom Tab** (real browser)
3. User approves permissions
4. Google redirects back to your app (via Deep Link)
5. Your web app handles the OAuth callback normally

**User Experience:**
- Chrome Custom Tab slides up over your app
- User sees Google's official login page
- After login, Chrome tab closes automatically
- User returns to your app (now logged in)

---

## E) UX & Behavior

### How Login Appears to Users

**Step-by-Step Flow:**

1. **App Launch**
   - User opens CloudMiner app icon
   - Splash screen displays (1-2 seconds)
   - Main app loads in fullscreen (no browser UI)

2. **Tap "Sign in with Google"**
   - Chrome Custom Tab slides up from bottom
   - Shows Google's official login page
   - User sees Chrome UI (address bar, lock icon)
   - User trusts this because it's real Chrome

3. **User Logs In**
   - Enters Google credentials
   - Approves permissions
   - Google processes OAuth

4. **Redirect Back to App**
   - Chrome Custom Tab closes automatically
   - User returns to app (now logged in)
   - App displays user's dashboard

**Visual Example:**
```
┌────────────────────┐
│  CloudMiner App    │  ← Fullscreen app (no browser UI)
│                    │
│  [Sign in with    │
│   Google]          │  ← User taps this button
│                    │
└────────────────────┘
         ↓
┌────────────────────┐
│ ← yourdomain.com  │  ← Chrome Custom Tab appears
│─────────────────────│
│  🔒 Google Login   │  ← Real Chrome browser
│                    │
│  [Email]           │
│  [Password]        │
│  [Sign In]         │
└────────────────────┘
         ↓
┌────────────────────┐
│  CloudMiner App    │  ← Back to app (logged in)
│                    │
│  Welcome, John!    │
│  💰 Balance: $50   │
└────────────────────┘
```

---

### Whether Chrome UI is Visible or Hidden

**TWA Fullscreen Mode (Verified App):**
- ✅ **No address bar**
- ✅ **No Chrome buttons**
- ✅ **No "Open in Chrome" button**
- ✅ Looks 100% like native app
- ✅ Status bar matches your theme color

**Requirement:** Digital Asset Links must be verified (see section B)

**Chrome Custom Tabs (OAuth Only):**
- ✅ **Address bar visible** (for security)
- ✅ **Lock icon visible** (HTTPS indicator)
- ✅ **Chrome branding** (users trust it)
- ✅ **Close button** (returns to app)

**Fallback Mode (Digital Asset Links NOT Verified):**
- ⚠️ Address bar visible
- ⚠️ "Open in Chrome" button appears
- ⚠️ Feels less like native app
- **Fix:** Verify Digital Asset Links (section B, step 4)

---

### Back Button Behavior

**In-App Navigation:**
```
Home → Profile → Settings → [BACK] → Profile → [BACK] → Home
```
Back button works like web browser history.

**Exiting App:**
```
Home → [BACK] → App minimizes (goes to background)
```
Press back on start URL = app minimizes (doesn't close completely)

**After OAuth:**
```
App → OAuth Login → [BACK] → OAuth cancels → Back to app
```
If user presses back during OAuth, login is canceled gracefully.

**Custom Back Behavior (Optional):**
You can override back button in your React app:

```javascript
// src/hooks/useBackButton.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useBackButton() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (e) => {
      // Custom logic: go to dashboard instead of browser back
      if (window.location.pathname !== '/') {
        e.preventDefault();
        navigate('/dashboard');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [navigate]);
}
```

---

### App Resume Behavior

**Scenario: User Switches Apps**
```
CloudMiner app → Switch to Messages app → Switch back to CloudMiner
```
**Result:** App resumes exactly where user left off (React state preserved)

**Scenario: App in Background Overnight**
```
CloudMiner app → Lock phone → Sleep → Wake up next morning → Open app
```
**Result:**
- App reloads (refreshes) if Android killed the process
- Session may expire if your backend has short timeouts
- User may need to log in again

**Best Practice:** Implement session persistence in your React app:

```javascript
// src/context/AuthContext.jsx
useEffect(() => {
  // On app resume, check if session is still valid
  const checkSession = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          // Session expired, clear local data
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    }
  };

  // Check session on mount and when app resumes from background
  checkSession();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkSession();
  });
}, []);
```

---

### Session Cookies Behavior

**Cookies Work Identically to Web:**
- TWA shares cookies with Chrome browser on the device
- Sessions persist across app restarts (until timeout)
- Logging in via TWA = logged in on Chrome mobile browser (same device)
- Logging out via TWA = logged out on Chrome mobile browser

**If You Use JWT/Token Auth:**
- Store tokens in `localStorage` or `sessionStorage`
- TWA has full access (same as web)
- Tokens persist until cleared

**If You Use HTTP-Only Cookies:**
- Backend sets cookies via `Set-Cookie` header
- TWA respects `SameSite`, `Secure`, `HttpOnly` flags
- Works identically to web browser

**Example API Request from TWA:**
```javascript
// Your existing API code works unchanged
fetch('https://yourdomain.com/api/user', {
  method: 'GET',
  credentials: 'include', // Send cookies
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## F) Testing Checklist

### Pre-Launch Testing

**1. Login Test**
- [ ] Install APK on physical Android device
- [ ] Open app (should load in fullscreen)
- [ ] Tap "Sign in with Google"
- [ ] Chrome Custom Tab opens
- [ ] Log in with Google account
- [ ] Redirected back to app successfully
- [ ] User profile displays correctly
- [ ] No OAuth errors (no `disallowed_useragent`)

**2. Session Persistence Test**
- [ ] Log in successfully
- [ ] Close app (swipe away from recent apps)
- [ ] Reopen app
- [ ] User still logged in (no re-authentication needed)
- [ ] Wait 1 hour, reopen app
- [ ] Session still valid (or shows login screen if expired)

**3. Network Failure Test**
- [ ] Enable Airplane Mode
- [ ] Open app
- [ ] Shows offline message or cached content
- [ ] Disable Airplane Mode
- [ ] App reconnects automatically
- [ ] Data syncs correctly

**4. Deep Link Test (Optional)**
- [ ] Open browser on phone
- [ ] Navigate to `https://yourdomain.com/profile`
- [ ] Android shows "Open with CloudMiner" prompt
- [ ] Tap "Open with CloudMiner"
- [ ] App opens directly to `/profile` page

**5. Logout Test**
- [ ] Log in
- [ ] Tap "Logout" in app
- [ ] Redirected to login screen
- [ ] Reopen app
- [ ] Still logged out (session cleared)

**6. Multi-Account Test**
- [ ] Log in with Account A
- [ ] Logout
- [ ] Log in with Account B
- [ ] Correct user profile displays (no Account A data)

**7. Update Test**
- [ ] Install version 1.0.0
- [ ] Make changes to website
- [ ] Build version 1.0.1 (increment `appVersionCode`)
- [ ] Install new APK (should upgrade, not create duplicate)
- [ ] User data preserved after update

---

### Play Store Pre-Launch Checklist

Before uploading to Google Play Console:

**App Requirements:**
- [ ] AAB file built (not APK)
- [ ] Version code incremented
- [ ] Signed with production keystore
- [ ] App size under 150 MB (TWA apps are typically 1-5 MB)
- [ ] minSdkVersion 21 or higher (Android 5.0+)
- [ ] targetSdkVersion 33 or higher (latest stable)

**Content Requirements:**
- [ ] Privacy Policy URL ready
- [ ] Terms of Service URL ready
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2)
- [ ] App description written
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters)

**Technical Requirements:**
- [ ] Digital Asset Links verified
- [ ] `assetlinks.json` publicly accessible
- [ ] HTTPS certificate valid
- [ ] Google OAuth working on production domain
- [ ] No console errors on website

**Play Console Steps:**
1. Go to https://play.google.com/console
2. Create new app
3. Upload AAB file
4. Fill out store listing
5. Set content rating (questionnaire)
6. Set up pricing & distribution
7. Create internal testing track (test with friends first)
8. Submit for review (takes 1-7 days)

---

### Common Issues & Quick Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| App shows address bar | Digital Asset Links not verified | Verify `assetlinks.json` is accessible and SHA-256 matches |
| OAuth blocked error | Using wrong OAuth client | Add Android OAuth client in Google Cloud Console |
| App doesn't open website | Wrong `host` in `twa-manifest.json` | Set `host` to exact domain (no `https://`) |
| Icons not loading | Wrong paths in `manifest.json` | Use absolute URLs: `https://yourdomain.com/icons/...` |
| App crashes on launch | Invalid start URL | Set `startUrl: "/"` in `twa-manifest.json` |
| Can't install APK | Signature mismatch | Uninstall old version first, then reinstall |
| Play Store rejects AAB | Missing permissions | Add required permissions in `AndroidManifest.xml` |
| Session doesn't persist | Cookies not set | Ensure backend sets `SameSite=None; Secure` cookies |

---

## G) Optional Enhancements

### 1. Offline Fallback Page

Show a custom page when user has no internet connection.

**Create Offline Page:**
```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudMiner - Offline</title>
  <style>
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: #1a1f2e;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .offline-container {
      max-width: 400px;
      padding: 40px;
    }
    .offline-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      color: #9ca3af;
      margin-bottom: 24px;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="offline-icon">📡</div>
    <h1>No Internet Connection</h1>
    <p>Please check your internet connection and try again.</p>
    <button onclick="window.location.reload()">Retry</button>
  </div>
</body>
</html>
```

**Register Service Worker:**
```javascript
// public/sw.js (Service Worker)
const CACHE_NAME = 'cloudminer-v1';
const OFFLINE_URL = '/offline.html';

// Install event: cache offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// Fetch event: serve offline page when network fails
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Register in `index.html`:**
```javascript
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

### 2. Splash Screen Optimization

Customize splash screen to match your brand.

**Android Splash Configuration:**

Edit `cloudminer-twa/android/app/src/main/res/values/styles.xml`:

```xml
<resources>
  <style name="LauncherTheme" parent="Theme.SplashScreen">
    <!-- Status bar color -->
    <item name="android:statusBarColor">#1a1f2e</item>

    <!-- Splash screen background -->
    <item name="android:windowBackground">@drawable/splash_background</item>

    <!-- Fade out duration (milliseconds) -->
    <item name="postSplashScreenTheme">@style/Theme.App.SplashScreen</item>
  </style>
</resources>
```

**Custom Splash Drawable:**

Create `android/app/src/main/res/drawable/splash_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Background color -->
  <item android:drawable="@color/splash_background" />

  <!-- Centered logo -->
  <item>
    <bitmap
      android:gravity="center"
      android:src="@drawable/splash_logo" />
  </item>
</layer-list>
```

**Or Simply:** Replace `splash.png` in Bubblewrap project root, then rebuild.

---

### 3. Status Bar & Theme Color Alignment

Match Android status bar with your app design.

**Set Theme Color in `manifest.json`:**
```json
{
  "theme_color": "#1a1f2e",
  "background_color": "#1a1f2e"
}
```

**Dynamic Theme Color (React):**
```javascript
// src/App.jsx
useEffect(() => {
  // Change theme color based on current page
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (location.pathname === '/dashboard') {
    metaThemeColor.setAttribute('content', '#1a1f2e');
  } else if (location.pathname === '/portfolio') {
    metaThemeColor.setAttribute('content', '#10b981'); // Green
  }
}, [location.pathname]);
```

**Status Bar Color (Android):**
Automatically matches `theme_color` in manifest. No additional config needed.

---

### 4. Push Notifications (Optional)

Enable web push notifications in TWA.

**Step 1: Enable in `twa-manifest.json`:**
```json
{
  "enableNotifications": true
}
```

**Step 2: Request Permission in React:**
```javascript
// src/services/notifications.js
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function showNotification(title, options) {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}
```

**Step 3: Use Firebase Cloud Messaging (FCM):**
Follow Google's FCM setup for web:
https://firebase.google.com/docs/cloud-messaging/js/client

---

### 5. App Shortcuts (Optional)

Add shortcuts to app icon (long-press menu).

**Configure in `twa-manifest.json`:**
```json
{
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "url": "/dashboard",
      "icon": "https://yourdomain.com/icons/dashboard-96x96.png"
    },
    {
      "name": "Portfolio",
      "short_name": "Portfolio",
      "url": "/portfolio",
      "icon": "https://yourdomain.com/icons/portfolio-96x96.png"
    },
    {
      "name": "Wallet",
      "short_name": "Wallet",
      "url": "/wallet",
      "icon": "https://yourdomain.com/icons/wallet-96x96.png"
    }
  ]
}
```

**Rebuild:**
```bash
bubblewrap build
```

**User Experience:**
- Long-press CloudMiner app icon
- Android shows shortcut menu
- User taps "Portfolio"
- App opens directly to `/portfolio`

---

## Troubleshooting

### Issue: App Shows Address Bar (Not Fullscreen)

**Cause:** Digital Asset Links not verified

**Fix:**
1. Verify `assetlinks.json` is accessible:
   ```bash
   curl https://yourdomain.com/.well-known/assetlinks.json
   ```
2. Verify SHA-256 fingerprint matches keystore:
   ```bash
   keytool -list -v -keystore ./android.keystore -alias cloudminer-key
   ```
3. Check package name matches in:
   - `assetlinks.json` → `package_name`
   - `twa-manifest.json` → `packageId`
   - Android app → `AndroidManifest.xml`

4. Wait 5-10 minutes for Google's cache to update
5. Clear app data and reinstall

---

### Issue: Google OAuth Blocked (`disallowed_useragent`)

**Cause:** OAuth client not configured for Android

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create **Android OAuth Client**
3. Add SHA-1 fingerprint (not SHA-256):
   ```bash
   keytool -list -v -keystore ./android.keystore -alias cloudminer-key | grep SHA1
   ```
4. Set package name: `com.cloudminer.app`
5. Wait 5 minutes for changes to propagate
6. Test login again

---

### Issue: App Crashes on Launch

**Cause:** Invalid `start_url` or network error

**Fix:**
1. Check Chrome DevTools console (connect phone via USB debugging)
2. Verify website loads in Chrome mobile browser
3. Check `twa-manifest.json`:
   ```json
   {
     "host": "yourdomain.com",    // No https://, no trailing slash
     "startUrl": "/"               // Must start with /
   }
   ```
4. Rebuild and reinstall

---

### Issue: Can't Verify Digital Asset Links

**Cause:** JSON syntax error or hosting issue

**Fix:**
1. Validate JSON syntax:
   ```bash
   cat public/.well-known/assetlinks.json | python -m json.tool
   ```
2. Check Content-Type header:
   ```bash
   curl -I https://yourdomain.com/.well-known/assetlinks.json
   ```
   Should return: `Content-Type: application/json`

3. Ensure no CDN caching:
   - Clear CloudFlare/CDN cache
   - Add cache bypass for `.well-known/*`

4. Test Google's verification:
   ```
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls
   ```

---

### Issue: Session Doesn't Persist

**Cause:** Cookies not set with correct attributes

**Fix (Backend - PHP):**
```php
// api/controllers/AuthController.php
session_set_cookie_params([
    'lifetime' => 86400 * 7,  // 7 days
    'path' => '/',
    'domain' => 'yourdomain.com',
    'secure' => true,         // HTTPS only
    'httponly' => true,       // Prevent JS access
    'samesite' => 'None'      // Required for TWA
]);
```

**Or JWT/Token Auth:**
```javascript
// src/context/AuthContext.jsx
localStorage.setItem('authToken', token);  // Persists across app restarts
```

---

### Issue: Icons Don't Load

**Cause:** Relative paths in `manifest.json`

**Fix:** Use absolute URLs:
```json
{
  "icons": [
    {
      "src": "https://yourdomain.com/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

### Issue: Play Store Rejects APK

**Cause:** Various policy violations

**Common Fixes:**
- **"Missing permissions":** Add required permissions in `AndroidManifest.xml`
- **"Target SDK too low":** Set `targetSdkVersion: 33` in `twa-manifest.json`
- **"Privacy policy required":** Add Privacy Policy URL in Play Console
- **"Content rating needed":** Complete content rating questionnaire
- **"App Bundle required":** Upload `.aab` file, not `.apk`

---

## Summary: Quick Reference

### Files to Create

```
Your Web App:
  public/
    ├── manifest.json                          # PWA manifest
    ├── icons/                                 # App icons (8 sizes)
    │   ├── icon-72x72.png
    │   ├── icon-96x96.png
    │   ├── icon-128x128.png
    │   ├── icon-144x144.png
    │   ├── icon-152x152.png
    │   ├── icon-192x192.png
    │   ├── icon-384x384.png
    │   └── icon-512x512.png
    └── .well-known/
        └── assetlinks.json                    # Digital Asset Links

Android TWA Project (separate directory):
  cloudminer-twa/
    ├── twa-manifest.json                      # Bubblewrap config
    ├── android.keystore                       # Signing key (BACKUP!)
    ├── app-release-signed.apk                 # Testing APK
    └── app-release-bundle.aab                 # Play Store AAB
```

---

### Commands Cheat Sheet

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA
bubblewrap init --manifest=https://yourdomain.com/manifest.json

# Build APK (testing)
bubblewrap build

# Build AAB (Play Store)
bubblewrap build

# Update app after website changes
bubblewrap update

# Install APK on device
adb install app-release-signed.apk

# Get SHA-256 fingerprint
keytool -list -v -keystore ./android.keystore -alias cloudminer-key

# Verify Digital Asset Links
curl https://yourdomain.com/.well-known/assetlinks.json
```

---

### Final Checklist

Before submitting to Play Store:

- [ ] Website works on HTTPS with valid SSL
- [ ] `manifest.json` accessible at `/manifest.json`
- [ ] All 8 icon sizes created and accessible
- [ ] `assetlinks.json` accessible at `/.well-known/assetlinks.json`
- [ ] Digital Asset Links verified via Google's API
- [ ] Android OAuth Client created in Google Cloud Console
- [ ] SHA-1 and SHA-256 fingerprints added to OAuth client
- [ ] TWA app built with production keystore
- [ ] Keystore file backed up securely
- [ ] App tested on physical Android device
- [ ] Google OAuth login works without errors
- [ ] Session persists after closing and reopening app
- [ ] App opens in fullscreen (no address bar)
- [ ] AAB file built and ready for upload
- [ ] Privacy Policy and Terms of Service URLs ready
- [ ] App store listing prepared (icon, screenshots, description)
- [ ] Content rating questionnaire completed

---

## Next Steps

1. **Create Icons:** Generate all 8 icon sizes (use tool like `pwa-asset-generator`)
2. **Create `manifest.json`:** Copy the template from Section A
3. **Deploy to Production:** Push `manifest.json`, icons, and `assetlinks.json` to your live server
4. **Initialize Bubblewrap:** Run `bubblewrap init` in a new directory
5. **Build APK:** Run `bubblewrap build` and test on your phone
6. **Verify Asset Links:** Use Google's verification tool
7. **Configure OAuth:** Add Android client in Google Cloud Console
8. **Test Thoroughly:** Complete all items in Testing Checklist (Section F)
9. **Build AAB:** Run `bubblewrap build` for final Play Store upload
10. **Submit to Play Store:** Create app listing and upload AAB

---

## Support Resources

- **Bubblewrap Documentation:** https://github.com/GoogleChromeLabs/bubblewrap
- **TWA Guide:** https://developer.chrome.com/docs/android/trusted-web-activity/
- **Digital Asset Links:** https://developers.google.com/digital-asset-links/v1/getting-started
- **Google OAuth Setup:** https://developers.google.com/identity/protocols/oauth2
- **Play Store Publishing:** https://developer.android.com/distribute/googleplay

---

**Good luck with your TWA implementation! 🚀**

If you encounter issues not covered in this guide, check:
1. Chrome DevTools console (USB debugging)
2. Android Logcat (`adb logcat`)
3. Google Play Console pre-launch reports
