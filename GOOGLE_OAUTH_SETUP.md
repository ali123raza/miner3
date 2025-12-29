# Google OAuth Configuration for TWA

## Complete Step-by-Step Guide

This guide shows you exactly how to configure Google OAuth to work with your CloudMiner Android app.

---

## Prerequisites

Before starting:
- ✅ Android app built with Bubblewrap
- ✅ SHA-1 fingerprint from keystore (run `configure-asset-links.js`)
- ✅ Package name: `com.cloudminer.app` (or your chosen package)
- ✅ Google Cloud project with OAuth already configured for web

---

## Step 1: Get SHA-1 Fingerprint

### Automated Way (Recommended)

```bash
node configure-asset-links.js
```

This script will automatically extract both SHA-256 and SHA-1 fingerprints.

### Manual Way

```bash
cd cloudminer-twa
keytool -list -v -keystore android.keystore -alias android
```

Look for this line:
```
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

**Important:** For Google OAuth, use SHA-1 (NOT SHA-256), and KEEP the colons!

---

## Step 2: Open Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials

2. Select your existing project (the one with your website OAuth configured)

3. You should see your existing **Web OAuth Client** listed

---

## Step 3: Create Android OAuth Client

### Click "Create Credentials"

1. Click **+ CREATE CREDENTIALS** (blue button at top)

2. Select **OAuth client ID**

### Configure Android Application

| Field | Value | Example |
|-------|-------|---------|
| **Application type** | Android | (Select from dropdown) |
| **Name** | CloudMiner Android App | (Any descriptive name) |
| **Package name** | com.cloudminer.app | (Must match your TWA package) |
| **SHA-1 certificate fingerprint** | AA:BB:CC:DD:... | (From Step 1, with colons) |

### Important Notes

- **Package name** must EXACTLY match what you used in Bubblewrap
- **SHA-1** must be copied correctly (with colons)
- **Don't** use SHA-256 here (that's for Digital Asset Links)
- **Don't** modify your existing Web OAuth client

### Click "CREATE"

Google will create a new OAuth client ID specifically for your Android app.

---

## Step 4: Verify Configuration

After creating the Android OAuth client, verify you have:

### In Google Cloud Console → Credentials

**Web OAuth Client (existing):**
- ✅ Client ID: `xxxxx.apps.googleusercontent.com`
- ✅ Authorized JavaScript origins: `https://yourdomain.com`
- ✅ Authorized redirect URIs: Your callback URLs

**Android OAuth Client (new):**
- ✅ Client ID: `yyyyy.apps.googleusercontent.com`
- ✅ Package name: `com.cloudminer.app`
- ✅ SHA-1 fingerprint: `AA:BB:CC:...`

**Both clients should exist!** Don't delete the web client.

---

## Step 5: No Code Changes Needed!

**Important:** You do NOT need to update your React app code.

The Android app uses the SAME OAuth flow as your website:
- User clicks "Sign in with Google"
- Chrome Custom Tab opens
- Google recognizes it's coming from a verified Android app
- OAuth succeeds automatically

No changes to:
- ❌ Client ID in your React app
- ❌ Redirect URIs
- ❌ OAuth initialization code
- ❌ API calls

Everything works through the browser (Chrome Custom Tab), which uses your existing web OAuth configuration.

---

## Step 6: Testing OAuth

### Install APK on Device

```bash
cd cloudminer-twa
adb install app-release-signed.apk
```

Or transfer APK to phone and install manually.

### Test Login Flow

1. Open CloudMiner app on phone

2. Tap "Sign in with Google"

3. **Expected behavior:**
   - Chrome Custom Tab slides up
   - Shows Google login page (with address bar)
   - Login form appears
   - After login, redirects back to app
   - User is logged in successfully

4. **Error: "disallowed_useragent"**
   - Android OAuth client not configured
   - SHA-1 fingerprint incorrect
   - Package name mismatch
   - Wait 5 minutes after creating OAuth client

5. **Error: "redirect_uri_mismatch"**
   - Check your web OAuth client redirect URIs
   - Ensure callback URL is correct
   - This is NOT related to the Android OAuth client

---

## Common Issues & Solutions

### Issue: "This browser or app may not be secure"

**Cause:** Android OAuth client not configured

**Solution:**
1. Go to Google Cloud Console
2. Create Android OAuth client (Step 3 above)
3. Add correct SHA-1 fingerprint
4. Wait 5 minutes
5. Try again

---

### Issue: SHA-1 vs SHA-256 Confusion

**For Digital Asset Links (assetlinks.json):**
- Use **SHA-256**
- Remove colons
- Example: `AABBCCDD...`

**For Google OAuth (Android client):**
- Use **SHA-1**
- Keep colons
- Example: `AA:BB:CC:DD:...`

---

### Issue: Package Name Mismatch

**Check package name in:**

1. `twa-config.json`:
   ```json
   {
     "project": {
       "packageId": "com.cloudminer.app"
     }
   }
   ```

2. `cloudminer-twa/twa-manifest.json`:
   ```json
   {
     "packageId": "com.cloudminer.app"
   }
   ```

3. Google Cloud Console → Android OAuth Client:
   - Package name: `com.cloudminer.app`

All three MUST match exactly!

---

### Issue: OAuth Works on Website, Not in App

**Likely causes:**

1. **Android OAuth client not created**
   - Create it in Google Cloud Console
   - Use SHA-1 fingerprint

2. **Wrong fingerprint**
   - Verify SHA-1 is correct
   - Check you're using the release keystore (not debug)

3. **Digital Asset Links not verified**
   - This doesn't block OAuth, but breaks fullscreen
   - Check with Google's verification tool

4. **Need to wait**
   - OAuth configuration takes 2-5 minutes to propagate
   - Try again after waiting

---

## Step 7: Debug OAuth Issues

### Enable Chrome DevTools on Android

1. Connect phone via USB
2. Enable USB debugging
3. Open Chrome on computer
4. Go to: `chrome://inspect/#devices`
5. Click "inspect" on your app
6. Check Console for errors

### Check OAuth Error Messages

Common errors in console:

| Error | Meaning | Solution |
|-------|---------|----------|
| `disallowed_useragent` | Android OAuth not configured | Create Android OAuth client |
| `redirect_uri_mismatch` | Callback URL wrong | Check web OAuth redirect URIs |
| `invalid_client` | Client ID wrong | Don't change client ID in code |
| `access_denied` | User cancelled | Normal behavior |

---

## Step 8: Production Checklist

Before launching to users:

### Google OAuth Configuration
- [ ] Android OAuth client created
- [ ] SHA-1 fingerprint added (with colons)
- [ ] Package name matches (`com.cloudminer.app`)
- [ ] Web OAuth client still exists (don't delete it)
- [ ] Tested login on physical device
- [ ] No `disallowed_useragent` error

### Digital Asset Links
- [ ] SHA-256 fingerprint in assetlinks.json (without colons)
- [ ] assetlinks.json deployed to `/.well-known/assetlinks.json`
- [ ] Google verification shows verified
- [ ] App opens in fullscreen (no address bar)

### Testing
- [ ] Login works on test device
- [ ] Logout works
- [ ] Session persists after closing app
- [ ] Multiple accounts can login/switch
- [ ] Network offline/online handled correctly

---

## Quick Reference

### Get SHA-1 (for OAuth)
```bash
keytool -list -v -keystore cloudminer-twa/android.keystore -alias android | grep SHA1
```

### Get SHA-256 (for Asset Links)
```bash
keytool -list -v -keystore cloudminer-twa/android.keystore -alias android | grep SHA256
```

### Test Asset Links
```bash
curl https://yourdomain.com/.well-known/assetlinks.json
```

### Google Verification
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls
```

---

## Summary

### What You Did

1. ✅ Got SHA-1 fingerprint from Android keystore
2. ✅ Created Android OAuth client in Google Cloud Console
3. ✅ Added SHA-1 fingerprint to Android OAuth client
4. ✅ Set package name to match TWA package
5. ✅ Tested login flow on device

### What You Didn't Need to Do

- ❌ Change React app code
- ❌ Update Client ID
- ❌ Modify redirect URIs
- ❌ Add new API keys
- ❌ Change OAuth initialization

### Why It Works

TWA uses Chrome Custom Tabs (real Chrome browser), which:
- ✅ Shares cookies with Chrome
- ✅ Uses your existing web OAuth setup
- ✅ Passes Google's security checks
- ✅ Looks like a verified app to Google

The Android OAuth client just tells Google: "This Android app is allowed to use this website's OAuth."

---

## Need Help?

**If OAuth still doesn't work after following this guide:**

1. Wait 5 minutes after creating OAuth client
2. Clear app data and reinstall
3. Check Chrome DevTools console for exact error
4. Verify SHA-1 fingerprint is correct
5. Verify package name matches everywhere
6. Check that Digital Asset Links are verified (different issue, but can help diagnose)

**Common mistake:** Using SHA-256 instead of SHA-1 for OAuth (SHA-256 is for Asset Links only).

---

**You're done! Google OAuth should now work in your Android app.** 🎉
