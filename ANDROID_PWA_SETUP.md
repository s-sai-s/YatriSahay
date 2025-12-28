# Android PWA Setup Guide

## PWA Installation on Android

### Automatic Installation Prompt

The app includes an automatic install prompt that appears on Android devices. When you visit the app:

1. **Look for the "📱 Install App" button** in the bottom-right corner
2. **Tap the button** to install the PWA
3. The app will be installed on your home screen

### Manual Installation

If the install button doesn't appear:

1. **Open Chrome** on your Android device
2. **Navigate to the app URL**
3. **Tap the menu** (three dots) in the top-right
4. **Select "Add to Home Screen"** or **"Install App"**
5. **Confirm installation**

### After Installation

Once installed, the app will:
- Appear in your app drawer
- Have its own icon on the home screen
- Work offline (with cached content)
- Open in standalone mode (no browser UI)

## Handling Google Maps Links

### Supported Google Maps URL Formats

The app supports all common Google Maps URL formats:

1. **Standard Maps URLs:**
   - `https://maps.google.com/?q=ADDRESS`
   - `https://maps.google.com/?q=LAT,LNG` (coordinates)
   - `https://www.google.com/maps/place/ADDRESS`
   - `https://www.google.com/maps/search/ADDRESS`
   - `https://www.google.com/maps/dir/?api=1&destination=ADDRESS`

2. **Short Links:**
   - `https://maps.app.goo.gl/XXXXX`
   - `https://goo.gl/maps/XXXXX`

3. **Query Parameters:**
   - `?q=` - Search query
   - `?daddr=` - Destination address
   - `?saddr=` - Source address
   - `?ll=` - Latitude, longitude

### Setting as Default Handler

To make YatriSahay appear when opening Google Maps links:

1. **Go to Android Settings**
2. **Apps → Default Apps → Opening Links**
3. **Find "YatriSahay"** in the list
4. **Enable it** for Google Maps links
5. **Select which link types** to handle:
   - `maps.google.com`
   - `google.com/maps`
   - `maps.app.goo.gl`
   - `goo.gl/maps`

### Using Share Menu

1. **Receive a Google Maps link** in WhatsApp, SMS, etc.
2. **Long-press the link**
3. **Select "Share"** or **"Open with"**
4. **Choose "YatriSahay"** from the list
5. The app will open with the address pre-filled

## Troubleshooting

### App Not Installing

**Check Requirements:**
- Android 5.0+ (Lollipop)
- Chrome browser (latest version)
- HTTPS connection (required for PWAs)
- Service worker support enabled

**Solutions:**
1. Clear Chrome cache and cookies
2. Update Chrome to latest version
3. Check if service worker is registered (open DevTools → Application → Service Workers)
4. Verify manifest.json is accessible

### Install Button Not Showing

**Possible Reasons:**
- App is already installed
- Browser doesn't support PWA installation
- Service worker not registered
- Missing required manifest fields

**Solutions:**
1. Check if app is already installed (look in app drawer)
2. Try manual installation via Chrome menu
3. Check browser console for errors
4. Verify manifest.json is valid

### Google Maps Links Not Opening in App

**Check Settings:**
1. Go to Settings → Apps → Default Apps → Opening Links
2. Find YatriSahay
3. Ensure it's enabled for Google Maps links

**Alternative Methods:**
1. Use the Share menu to select YatriSahay
2. Copy the link and use the app's paste functionality
3. Manually construct URL: `https://yourdomain.com/?maps_url=GOOGLE_MAPS_URL`

### App Not Appearing in Share Options

**Solutions:**
1. Reinstall the PWA
2. Clear app data and cache
3. Restart your device
4. Check if the app is properly installed (not just bookmarked)

## Testing PWA Installation

### Check Installation Status

1. **Open Chrome DevTools** (F12 or Menu → More Tools → Developer Tools)
2. **Go to Application tab**
3. **Check "Service Workers"** - should show registered
4. **Check "Manifest"** - should show all fields correctly
5. **Check "Storage"** - should show cached content

### Test URL Handling

Test with these URLs:
```
https://yourdomain.com/?maps_url=https://maps.google.com/?q=New+York
https://yourdomain.com/?maps_url=https://www.google.com/maps/place/Times+Square
https://yourdomain.com/?maps_url=https://maps.google.com/?q=40.7128,-74.0060
```

## Advanced Configuration

### Custom URL Scheme

For better integration, you can use a custom URL scheme:

```
yatrisahay://open?url=GOOGLE_MAPS_URL
```

This requires additional native app wrapper configuration.

### Intent Filters (Native App)

If wrapping as a native app, add to `AndroidManifest.xml`:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="maps.google.com" />
    <data android:scheme="https" android:host="www.google.com" android:pathPrefix="/maps" />
    <data android:scheme="https" android:host="maps.app.goo.gl" />
    <data android:scheme="https" android:host="goo.gl" android:pathPrefix="/maps" />
</intent-filter>
```

## Best Practices

1. **Always use HTTPS** - Required for PWAs
2. **Keep service worker updated** - Ensures offline functionality
3. **Test on multiple devices** - Different Android versions behave differently
4. **Monitor installation rates** - Use analytics to track PWA installations
5. **Provide clear instructions** - Help users understand how to install and use

## Support

For issues:
- Check Chrome version (should be latest)
- Verify Android version (5.0+)
- Test in incognito mode (to rule out extensions)
- Check browser console for errors
- Verify manifest.json is accessible and valid

