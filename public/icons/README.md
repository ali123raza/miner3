# App Icons Directory

This directory contains the app icons for PWA and TWA (Android APK).

## Required Icon Sizes

You need to create PNG icons at the following sizes:

| Filename | Size | Usage |
|----------|------|-------|
| `icon-72x72.png` | 72×72 | mdpi (1x) |
| `icon-96x96.png` | 96×96 | hdpi (1.5x) |
| `icon-128x128.png` | 128×128 | xhdpi (2x) |
| `icon-144x144.png` | 144×144 | xxhdpi (3x) |
| `icon-152x152.png` | 152×152 | iPad |
| `icon-192x192.png` | 192×192 | xxxhdpi (4x) |
| `icon-384x384.png` | 384×384 | High-res displays |
| `icon-512x512.png` | 512×512 | Splash screen, Play Store |

## Icon Requirements

✅ **Format:** PNG with transparency or solid background
✅ **Background:** Use brand color (#1a1f2e) or transparent
✅ **Content:** Center your logo with 20% padding/margin
✅ **Style:** Simple, recognizable at small sizes
✅ **Maskable:** Android may crop into circle/rounded square

## Quick Generation Methods

### Method 1: Online Tool (Easiest)

1. Create a single 1024×1024 master icon
2. Use online generator: https://realfavicongenerator.net/
3. Upload your master icon
4. Download generated icons
5. Copy to this directory

### Method 2: NPM Package (Automated)

```bash
# Install pwa-asset-generator
npm install -g pwa-asset-generator

# Generate icons from logo (SVG or PNG)
pwa-asset-generator public/logo.svg public/icons --background "#1a1f2e" --padding "20%"
```

### Method 3: ImageMagick (Command Line)

```bash
# Install ImageMagick first: https://imagemagick.org/

# Create a 1024×1024 master icon called logo-1024.png
# Then run these commands:

convert logo-1024.png -resize 72x72 icon-72x72.png
convert logo-1024.png -resize 96x96 icon-96x96.png
convert logo-1024.png -resize 128x128 icon-128x128.png
convert logo-1024.png -resize 144x144 icon-144x144.png
convert logo-1024.png -resize 152x152 icon-152x152.png
convert logo-1024.png -resize 192x192 icon-192x192.png
convert logo-1024.png -resize 384x384 icon-384x384.png
convert logo-1024.png -resize 512x512 icon-512x512.png
```

### Method 4: Figma/Photoshop (Manual)

1. Design your icon at 1024×1024
2. Export each size manually:
   - File → Export → PNG
   - Set size for each export
3. Name files according to the table above

## Design Guidelines

### Logo Placement
```
┌────────────────────┐
│                    │
│   ┌──────────┐     │  ← 20% padding
│   │          │     │
│   │   LOGO   │     │
│   │          │     │
│   └──────────┘     │
│                    │
└────────────────────┘
```

### Color Recommendations
- **Background:** `#1a1f2e` (dark blue-gray)
- **Logo:** White or light color for contrast
- **Accent:** Your brand colors

### What to Avoid
❌ Text that's too small (unreadable at 72×72)
❌ Complex details (simplify for small sizes)
❌ Transparent backgrounds (use solid color)
❌ Non-square aspect ratios

## Testing Icons

After generating icons:

1. **Test in Browser:**
   - Open `http://localhost:5173` in Chrome
   - Open DevTools → Application → Manifest
   - Verify all icons load correctly

2. **Test in TWA:**
   - Build Android APK
   - Install on device
   - Check app icon on home screen
   - Check splash screen

## Current Status

⚠️ **Icons not yet generated**

Once you create the icons, remove this warning and list them here:

- [ ] icon-72x72.png
- [ ] icon-96x96.png
- [ ] icon-128x128.png
- [ ] icon-144x144.png
- [ ] icon-152x152.png
- [ ] icon-192x192.png
- [ ] icon-384x384.png
- [ ] icon-512x512.png

## Need Help?

If you need design assistance, you can:

1. Hire a designer on Fiverr/Upwork (search "app icon design")
2. Use AI tools like DALL-E or Midjourney
3. Use free icon resources:
   - Flaticon: https://www.flaticon.com/
   - Icons8: https://icons8.com/
   - Noun Project: https://thenounproject.com/

**Estimated time:** 30-60 minutes (including design + generation)
