# Deep Link Setup Guide - Opening Google Maps Links from WhatsApp/SMS

This guide explains how to configure your YatriSahay app to open Google Maps links from WhatsApp, SMS, and other apps.

## Overview

When someone shares a Google Maps location link via WhatsApp, SMS, or other messaging apps, you want YatriSahay to be able to open that link and enable the Uber/Rapido booking buttons.

## Method 1: Using Share Target (Android Only)

**Note:** iOS PWAs have limited support for share targets. See **[IOS_SETUP.md](IOS_SETUP.md)** for iOS-specific solutions.

### How It Works

1. User receives a Google Maps link in WhatsApp/SMS
2. User taps the link
3. Browser opens and shows options to "Open with..."
4. User selects YatriSahay (if installed as PWA)
5. App opens with the address pre-filled

### Setup Steps

#### For Android (Chrome):

1. **Install the PWA:**
   - Open the app in Chrome
   - Tap the menu (three dots)
   - Select "Add to Home Screen" or "Install App"

2. **Set as Default Handler (Optional):**
   - Go to Android Settings → Apps → Default Apps → Opening Links
   - Find "YatriSahay" and enable it for Google Maps links

#### For iOS (Safari):

**⚠️ Important:** iOS PWAs cannot register as URL handlers for external links. This is an iOS limitation.

**Workarounds for iOS:**
1. **Use the built-in Paste button** - Copy the Google Maps link and tap "Paste Google Maps Link" in the app
2. **Set up iOS Shortcuts** - Create an automation to redirect Google Maps links (see IOS_SETUP.md)
3. **Use Safari bookmarklet** - Create a bookmark that redirects to your app
4. **Manual URL construction** - Use the /open route with the Google Maps URL

**See [IOS_SETUP.md](IOS_SETUP.md) for detailed iOS setup instructions.**

## Method 2: Using URL Scheme (For Native Wrapper)

If you wrap the PWA as a native app using Capacitor, Cordova, or similar:

### Android Configuration

Add to `AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="maps.google.com" />
        <data android:scheme="https" android:host="www.google.com" android:pathPrefix="/maps" />
    </intent-filter>
</activity>
```

### iOS Configuration

Add to `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>https</string>
        </array>
        <key>CFBundleURLName</key>
        <string>com.yatrisahay.app</string>
    </dict>
</array>
```

## Method 3: Manual Link Sharing

### Using the App's Share Handler

1. **Copy Google Maps Link:**
   - When you receive a Google Maps link, long-press and copy it

2. **Open YatriSahay:**
   - Open the YatriSahay app
   - The app will check if there's a link in the clipboard (if implemented)
   - Or manually paste the link in the address bar

3. **Using the /open Route:**
   - You can also use: `https://yourdomain.com/open?url=GOOGLE_MAPS_URL`
   - Replace `GOOGLE_MAPS_URL` with the encoded Google Maps URL

## Method 4: Browser Extension/Bookmarklet

Create a bookmarklet that redirects Google Maps links to your app:

```javascript
javascript:(function(){
    const url = window.location.href;
    if(url.includes('maps.google.com') || url.includes('google.com/maps')){
        window.location.href = 'https://yourdomain.com/?maps_url=' + encodeURIComponent(url);
    }
})();
```

## Testing Deep Links

### Test URLs:

1. **Direct Test:**
   ```
   http://localhost:3000/?maps_url=https://maps.google.com/?q=New+York
   ```

2. **With Coordinates:**
   ```
   http://localhost:3000/?maps_url=https://maps.google.com/?q=40.7128,-74.0060
   ```

3. **Place URL:**
   ```
   http://localhost:3000/?maps_url=https://www.google.com/maps/place/Times+Square
   ```

## Troubleshooting

### Links Not Opening in App

1. **Check PWA Installation:**
   - Ensure the app is installed as a PWA
   - Reinstall if necessary

2. **Check Browser Settings:**
   - Android: Settings → Apps → Default Apps → Opening Links
   - iOS: Settings → Safari → Open Links

3. **Verify URL Format:**
   - The app expects Google Maps URLs
   - Format: `https://maps.google.com/?q=ADDRESS`
   - Or: `https://www.google.com/maps/place/ADDRESS`

### App Not Showing in Share Options

1. **Reinstall PWA:**
   - Uninstall and reinstall the app
   - This refreshes the app's registration

2. **Clear Browser Cache:**
   - Clear browser cache and cookies
   - Reinstall the PWA

3. **Check Manifest:**
   - Verify `manifest.json` has correct `share_target` configuration
   - Ensure icons are properly configured

## Advanced: Custom URL Scheme

For better integration, you can register a custom URL scheme:

### Example: `yatrisahay://`

1. **Update manifest.json:**
   ```json
   {
     "protocol_handlers": [
       {
         "protocol": "web+yatrisahay",
         "url": "/?maps_url=%s"
       }
     ]
   }
   ```

2. **Usage:**
   - Links can use: `web+yatrisahay:https://maps.google.com/?q=New+York`
   - This will open directly in your app

## Production Deployment

When deploying to production:

1. **Update Callback URLs:**
   - Update OAuth redirect URI in Google Cloud Console
   - Update any hardcoded localhost URLs

2. **HTTPS Required:**
   - PWAs require HTTPS in production
   - Deep links work better with HTTPS

3. **Update Share Target:**
   - Update `manifest.json` share_target action URL
   - Use your production domain

## Support

For issues or questions:
- Check the main README.md troubleshooting section
- Verify all URLs match exactly (no trailing slashes, correct protocol)
- Test with different Google Maps URL formats

