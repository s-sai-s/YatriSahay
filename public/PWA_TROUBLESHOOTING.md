# PWA Installation Troubleshooting Guide

## Common Issues Preventing PWA Installation

### 1. Missing Icons

**Problem:** Icons are required for PWA installation. If `icon-192.png` and `icon-512.png` are missing, the PWA won't install.

**Solution:**
1. Open `public/create-icons.html` in your browser
2. Download the generated icons
3. Place them in the `public/` directory as:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

**Or create manually:**
- Use any image editor to create 192x192 and 512x512 PNG images
- Save them in the `public/` directory

### 2. Service Worker Not Registering

**Check in Browser:**
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** section
4. Should show "activated and is running"

**Common Issues:**
- Service worker file not accessible (404 error)
- HTTPS required (localhost is OK for development)
- Service worker scope issues

**Fix:**
- Verify `/sw.js` is accessible at `http://localhost:3000/sw.js`
- Check browser console for errors
- Clear browser cache and try again

### 3. Manifest.json Issues

**Check in Browser:**
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Manifest** in the left sidebar
4. Check for any errors (red text)

**Common Issues:**
- Invalid JSON syntax
- Missing required fields
- Icon paths incorrect
- Manifest not served with correct content-type

**Fix:**
- Validate JSON at https://jsonlint.com/
- Ensure all icon paths are correct
- Check server is serving manifest with `application/manifest+json` content-type

### 4. HTTPS Requirement

**Development:**
- `localhost` and `127.0.0.1` work without HTTPS
- Other local IPs require HTTPS

**Production:**
- HTTPS is **required** for PWA installation
- Use a valid SSL certificate

### 5. Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (Android & Desktop) - Full support
- Safari (iOS 11.3+) - Limited support
- Firefox - Limited support
- Samsung Internet - Full support

**Test:**
- Use Chrome for best results
- Update browser to latest version

### 6. Install Prompt Not Showing

**Requirements for Install Prompt:**
- ✅ Service worker registered
- ✅ Valid manifest.json
- ✅ Icons present (192x192 and 512x512)
- ✅ HTTPS (or localhost)
- ✅ User has interacted with the site
- ✅ Not already installed

**Check Installation Eligibility:**
```javascript
// Open browser console and run:
if ('serviceWorker' in navigator) {
  console.log('Service Worker: Supported');
} else {
  console.log('Service Worker: NOT Supported');
}

if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Already installed as PWA');
} else {
  console.log('Not installed yet');
}
```

### 7. Manifest Validation

**Validate your manifest:**
1. Go to https://manifest-validator.appspot.com/
2. Enter your app URL: `http://localhost:3000`
3. Check for errors

**Or use Chrome DevTools:**
1. Application tab → Manifest
2. Look for warnings/errors

### 8. Service Worker Caching Issues

**Clear Service Worker:**
1. Chrome DevTools → Application → Service Workers
2. Click "Unregister"
3. Clear Storage → Clear site data
4. Reload page

**Update Service Worker:**
- Change `CACHE_NAME` in `sw.js` to force update
- Or increment version number

### 9. Check Installation Criteria

Run this in browser console to check all criteria:

```javascript
async function checkPWAInstallability() {
  const checks = {
    serviceWorker: 'serviceWorker' in navigator,
    manifest: document.querySelector('link[rel="manifest"]') !== null,
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    icons: true // Check manually
  };
  
  console.table(checks);
  
  // Check manifest
  try {
    const response = await fetch('/manifest.json');
    const manifest = await response.json();
    console.log('Manifest:', manifest);
    console.log('Icons:', manifest.icons);
  } catch (e) {
    console.error('Manifest error:', e);
  }
  
  // Check service worker
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    console.log('Service Worker:', registration ? 'Registered' : 'Not registered');
  }
}

checkPWAInstallability();
```

### 10. Manual Installation Steps

If automatic prompt doesn't work:

**Chrome (Desktop):**
1. Click the install icon in address bar
2. Or: Menu (⋮) → "Install YatriSahay"

**Chrome (Android):**
1. Menu (⋮) → "Add to Home Screen"
2. Or: Menu → "Install App"

**Edge:**
1. Menu (⋯) → "Apps" → "Install this site as an app"

## Quick Fix Checklist

- [ ] Icons exist: `public/icon-192.png` and `public/icon-512.png`
- [ ] Service worker accessible: `http://localhost:3000/sw.js`
- [ ] Manifest accessible: `http://localhost:3000/manifest.json`
- [ ] Service worker registered (check DevTools)
- [ ] Manifest valid (check DevTools)
- [ ] Using HTTPS or localhost
- [ ] Browser supports PWAs (Chrome recommended)
- [ ] Not already installed
- [ ] User has interacted with page

## Testing Commands

**Check if PWA is installable:**
```bash
# In browser console
navigator.serviceWorker.ready.then(reg => console.log('SW ready:', reg))
```

**Force service worker update:**
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

**Check manifest:**
```bash
curl http://localhost:3000/manifest.json
```

## Still Not Working?

1. **Check browser console** for errors
2. **Check Network tab** - ensure all files load (no 404s)
3. **Try incognito mode** - rules out extensions
4. **Try different browser** - Chrome works best
5. **Check server logs** - ensure files are being served
6. **Verify file paths** - all paths should be relative to `/public`

## Production Checklist

- [ ] HTTPS enabled
- [ ] Valid SSL certificate
- [ ] Icons present and accessible
- [ ] Manifest.json accessible
- [ ] Service worker registered
- [ ] All assets load correctly
- [ ] Tested on multiple devices
- [ ] Tested on multiple browsers

