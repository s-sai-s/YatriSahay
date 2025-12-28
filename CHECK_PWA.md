# Quick PWA Installation Check

## Step 1: Verify Icons Exist

**CRITICAL:** PWA installation requires icons. Check if they exist:

```bash
ls -la public/icon-*.png
```

If missing, create them:
1. Open `public/create-icons.html` in browser
2. Download the icons
3. Place in `public/` directory

## Step 2: Test in Browser

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open Chrome DevTools (F12)**

3. **Go to Application tab:**
   - Check **Manifest** - should show no errors
   - Check **Service Workers** - should show "activated and is running"
   - Check **Storage** - should show cached files

4. **Check Console:**
   - Should see: "Service Worker registered successfully"
   - No errors about missing icons

## Step 3: Verify Files Are Accessible

Open these URLs in browser (should load, not 404):
- http://localhost:3000/manifest.json
- http://localhost:3000/sw.js
- http://localhost:3000/icon-192.png
- http://localhost:3000/icon-512.png

## Step 4: Check Installation Prompt

**Desktop Chrome:**
- Look for install icon in address bar
- Or: Menu (⋮) → "Install YatriSahay"

**Android Chrome:**
- Look for "📱 Install App" button (bottom-right)
- Or: Menu → "Add to Home Screen"

## Step 5: Run Diagnostic Script

Open browser console and run:

```javascript
// Check PWA installability
async function diagnosePWA() {
  console.log('=== PWA Installation Diagnostic ===\n');
  
  // 1. Service Worker
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    console.log('✅ Service Worker:', reg ? 'Registered' : '❌ NOT Registered');
    if (reg) console.log('   Scope:', reg.scope);
  } else {
    console.log('❌ Service Worker: NOT Supported');
  }
  
  // 2. Manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    try {
      const response = await fetch(manifestLink.href);
      const manifest = await response.json();
      console.log('✅ Manifest:', 'Found');
      console.log('   Icons:', manifest.icons?.length || 0, 'icons');
      console.log('   Display:', manifest.display);
      console.log('   Start URL:', manifest.start_url);
      
      // Check icons
      if (manifest.icons && manifest.icons.length > 0) {
        for (const icon of manifest.icons) {
          try {
            const iconRes = await fetch(icon.src);
            console.log(`   ${icon.src}:`, iconRes.ok ? '✅ Found' : '❌ Missing');
          } catch (e) {
            console.log(`   ${icon.src}:`, '❌ Missing');
          }
        }
      } else {
        console.log('   ❌ No icons in manifest');
      }
    } catch (e) {
      console.log('❌ Manifest:', 'Error loading -', e.message);
    }
  } else {
    console.log('❌ Manifest: NOT Found');
  }
  
  // 3. HTTPS
  const isSecure = location.protocol === 'https:' || 
                   location.hostname === 'localhost' || 
                   location.hostname === '127.0.0.1';
  console.log(isSecure ? '✅ HTTPS:' : '❌ HTTPS:', location.protocol);
  
  // 4. Already installed
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
  console.log(isInstalled ? 'ℹ️  Already installed as PWA' : '✅ Not installed yet');
  
  // 5. Install prompt availability
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
  });
  
  setTimeout(() => {
    console.log(deferredPrompt ? '✅ Install prompt:' : '❌ Install prompt:', 
                deferredPrompt ? 'Available' : 'Not available');
    console.log('\n=== Diagnostic Complete ===');
  }, 1000);
}

diagnosePWA();
```

## Common Issues & Fixes

### Issue: "Service Worker registration failed"
**Fix:** 
- Check `/sw.js` is accessible
- Check browser console for specific error
- Clear browser cache

### Issue: "Manifest: Error loading"
**Fix:**
- Check `/manifest.json` is accessible
- Validate JSON syntax
- Check server is serving with correct content-type

### Issue: "Icons: Missing"
**Fix:**
- Create icons using `create-icons.html`
- Ensure files are in `public/` directory
- Check file permissions

### Issue: Install prompt not showing
**Fix:**
- Ensure all above checks pass
- Try different browser (Chrome recommended)
- Clear browser cache and reload
- Check if already installed

## Next Steps

If all checks pass but still can't install:
1. See `PWA_TROUBLESHOOTING.md` for detailed solutions
2. Check browser version (update if needed)
3. Try incognito mode (rules out extensions)
4. Test on different device/browser

