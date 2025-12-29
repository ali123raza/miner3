# 🎯 APK Build Time - URL Configuration

## Direct Answer

**Jab APK build hogi, tab ye URL use hoga:**

```json
{
  "domain": {
    "url": "yourdomain.com",                           ← YE URL!
    "manifestUrl": "https://yourdomain.com/manifest.json"  ← Yahan se manifest download hogi
  }
}
```

**File location:** `twa-config.json` (line 9-10)

---

## 🔧 Build Process Step-by-Step

### **Jab Tum Ye Command Run Karoge:**

```bash
node setup-twa.js
```

### **Ye Process Hoga:**

**Step 1:** Script `twa-config.json` file read karegi
```javascript
const config = {
  "domain": {
    "url": "yourdomain.com"  ← Yahan se URL lega
  }
}
```

**Step 2:** Script tumse puchegi (agar config mein `yourdomain.com` hai):
```
Enter your production domain (e.g., cloudminer.app): ___
```

**Step 3:** Tum apna actual domain daalo:
```
cryptomining.app
```

**Step 4:** Script automatically update karegi:
```json
{
  "domain": {
    "url": "cryptomining.app",                        ← Updated!
    "manifestUrl": "https://cryptomining.app/manifest.json"
  }
}
```

**Step 5:** Bubblewrap us URL se manifest download karegi:
```bash
Downloading: https://cryptomining.app/manifest.json
```

**Step 6:** APK build hogi with that URL hardcoded:
```
APK opens: https://cryptomining.app
```

---

## 📱 APK Mein Kya Save Hoga

Build ke baad APK mein **permanently** ye URL save hoga:

```
App Start URL: https://cryptomining.app
Package Name:  com.cloudminer.app
```

**Matlab:**
- Jab bhi user app open karega
- App automatically `https://cryptomining.app` open karega
- Change nahi ho sakta (unless new APK build karo)

---

## 🎯 Abhi Tumhe Kya Karna Hai

### **Option 1: Manual Edit (Recommended)**

Edit `twa-config.json` directly:

```json
{
  "domain": {
    "url": "YOUR-ACTUAL-DOMAIN.com",  ← Yahan apna domain daalo
    "manifestUrl": "https://YOUR-ACTUAL-DOMAIN.com/manifest.json"
  }
}
```

**Example:**
```json
{
  "domain": {
    "url": "cryptomining.app",
    "manifestUrl": "https://cryptomining.app/manifest.json"
  }
}
```

### **Option 2: Script Se (Interactive)**

```bash
node setup-twa.js
```

Script tumse puchegi:
```
Enter your production domain (e.g., cloudminer.app): cryptomining.app
```

---

## ⚠️ Important Points

### **1. URL Must Be Live**

Jab tum build karoge, us time ye URL **live** hona chahiye:

```bash
# Ye URLs accessible hone chahiye:
✅ https://yourdomain.com/
✅ https://yourdomain.com/manifest.json
✅ https://yourdomain.com/icons/icon-512x512.png
```

**Agar live nahi hai:**
```
❌ Bubblewrap error dega
❌ "Cannot download manifest from URL"
```

### **2. URL Change = New Build**

Agar baad mein URL change karna hai:
```
1. Edit twa-config.json
2. Delete cloudminer-twa/ folder
3. Run setup-twa.js again
4. New APK build hogi
```

### **3. Localhost Nahi Chalega**

```
❌ WRONG: "localhost:5173"
❌ WRONG: "192.168.1.100"
❌ WRONG: "http://mysite.com" (HTTP nahi, HTTPS chahiye)

✅ CORRECT: "mysite.com" (HTTPS with valid SSL)
```

---

## 🔍 Build Time vs Runtime

### **Build Time (APK banate waqt):**
```
Source: twa-config.json
URL:    "yourdomain.com"
Action: Hardcode APK mein
```

### **Runtime (User app open karta hai):**
```
APK opens: https://yourdomain.com
Loads:     Your live website
Shows:     Fullscreen (no browser UI)
```

---

## 📋 Complete Example

### **Scenario: Tumhara domain hai `cryptomining.app`**

**Step 1: Edit config**
```json
// twa-config.json
{
  "domain": {
    "url": "cryptomining.app",
    "manifestUrl": "https://cryptomining.app/manifest.json"
  }
}
```

**Step 2: Run build**
```bash
node setup-twa.js
```

**Console Output:**
```
Verifying deployment...
✅ https://cryptomining.app/manifest.json - OK
✅ https://cryptomining.app/icons/icon-512x512.png - OK

Initializing Bubblewrap...
Downloading manifest from: https://cryptomining.app/manifest.json
✓ Manifest downloaded

Building APK...
✓ APK created: app-release-signed.apk
```

**Step 3: APK ready**
```
File: cloudminer-twa/app-release-signed.apk
Hardcoded URL: https://cryptomining.app
```

**Step 4: User installs**
```
User opens app → https://cryptomining.app loads
```

---

## ✅ Final Answer

### **Build time pe ye URL use hoga:**

```
File: twa-config.json
Line 9: "url": "yourdomain.com"  ← YE URL!
```

### **Tumhe karna ye hai:**

1. **Apna production domain decide karo**
   ```
   Example: cryptomining.app
   ```

2. **Edit `twa-config.json`**
   ```json
   "url": "cryptomining.app"
   ```

3. **Ensure website is live**
   ```
   https://cryptomining.app must work!
   ```

4. **Run build**
   ```bash
   node setup-twa.js
   ```

5. **APK ban jayegi with your URL**
   ```
   Opens: https://cryptomining.app
   ```

---

## 💡 Pro Tip

**Pehle website deploy karo, phir APK banao:**

```
Step 1: Deploy website → https://yourdomain.com ✅
Step 2: Verify working → curl https://yourdomain.com/manifest.json ✅
Step 3: Update config → twa-config.json ✅
Step 4: Build APK → node setup-twa.js ✅
```

**Ye sequence follow karo = no errors!** 🚀

---

## ❓ Quick Q&A

**Q: Localhost URL se build ho sakti hai?**
A: ❌ NO! Sirf live HTTPS domain.

**Q: HTTP URL se build ho sakti hai?**
A: ❌ NO! Sirf HTTPS (SSL required).

**Q: IP address use kar sakta hoon?**
A: ❌ NO! Domain name chahiye.

**Q: URL baad mein change kar sakta hoon?**
A: ⚠️ YES, but naya APK build karna padega.

**Q: Ek hi APK multiple domains pe chalegi?**
A: ❌ NO! Ek APK = Ek domain.

---

## 🎯 Summary

**Simple Answer:**
```
Build time URL = twa-config.json mein jo likha hai
Line 9: "url": "yourdomain.com"

Tumhe:
1. Ye file edit karni hai
2. Apna domain dalna hai
3. Website live karni hai
4. Phir build karna hai
```

**Samajh aa gaya?** 😊
