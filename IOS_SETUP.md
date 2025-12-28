# iOS Setup Guide - Opening Google Maps Links

## Important: iOS PWA Limitations

**iOS PWAs cannot register as URL handlers for external links** like native apps can. This is a limitation of iOS Safari. However, there are several workarounds available.

## Method 1: Paste Link Button (Easiest - Built-in)

The app includes a "Paste Google Maps Link" button that appears on iOS devices.

### Steps:

1. **Receive a Google Maps link** in WhatsApp, SMS, or any app
2. **Long-press the link** and select "Copy"
3. **Open YatriSahay app** (installed as PWA)
4. **Tap the "📋 Paste Google Maps Link" button**
5. The address will be processed and booking buttons will be enabled

**Note:** If clipboard access is denied, a prompt will appear for manual entry.

## Method 2: iOS Shortcuts App (Recommended)

Create an iOS Shortcut that redirects Google Maps links to your app.

### Setup Steps:

1. **Open the Shortcuts app** on your iPhone
2. **Tap the "+" button** to create a new shortcut
3. **Add "Get Contents of URL"** action
4. **Add "Open URLs"** action
5. **Configure the shortcut:**
   - Input: URL
   - Get Contents: The Google Maps URL
   - Open URLs: `https://yourdomain.com/?maps_url=[URL]`
   - Replace `yourdomain.com` with your app's domain

6. **Save the shortcut** as "Open in YatriSahay"
7. **Set up automation:**
   - Go to Automation tab
   - Create Personal Automation
   - Trigger: When URL is opened
   - Condition: URL contains "maps.google.com"
   - Action: Run "Open in YatriSahay" shortcut

### Alternative Shortcut (Simpler):

```javascript
// Shortcut: Open Maps Link in YatriSahay
// Input: URL
// Action: Open URLs
// URL: https://yourdomain.com/?maps_url=[Input URL]
```

## Method 3: Safari Bookmarklet

Create a bookmarklet that you can use when viewing Google Maps links.

### Setup:

1. **Open Safari** on your iPhone
2. **Bookmark any page**
3. **Edit the bookmark:**
   - Name: "Open in YatriSahay"
   - URL: Replace with this JavaScript:
   ```javascript
   javascript:(function(){
       const url = window.location.href;
       if(url.includes('maps.google.com') || url.includes('google.com/maps')){
           window.location.href = 'https://yourdomain.com/?maps_url=' + encodeURIComponent(url);
       } else {
           alert('This is not a Google Maps page');
       }
   })();
   ```
   - Replace `yourdomain.com` with your app's domain

4. **When viewing a Google Maps link:**
   - Tap the Share button
   - Select "Open in YatriSahay" bookmark
   - The app will open with the address

## Method 4: Share Extension (Advanced)

For a more native experience, you can create a Share Extension using a native wrapper.

### Using Capacitor:

1. **Install Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npx cap add ios
   ```

2. **Configure Share Extension** in Xcode
3. **Build and deploy** as a native app

## Method 5: Manual URL Construction

If you have the Google Maps link, you can manually construct the URL:

1. **Copy the Google Maps link**
2. **Open Safari** and go to:
   ```
   https://yourdomain.com/?maps_url=PASTE_LINK_HERE
   ```
   Replace `PASTE_LINK_HERE` with the encoded Google Maps URL

3. **Or use the /open route:**
   ```
   https://yourdomain.com/open?url=PASTE_LINK_HERE
   ```

## Method 6: iOS Focus Filters (iOS 16+)

If you're using iOS 16 or later, you can use Focus Filters:

1. **Settings → Focus → [Your Focus]**
2. **Add Filter → App → YatriSahay**
3. Configure to open when certain conditions are met

## Testing on iOS

### Test URLs:

1. **Direct test:**
   ```
   https://yourdomain.com/?maps_url=https://maps.google.com/?q=New+York
   ```

2. **With coordinates:**
   ```
   https://yourdomain.com/?maps_url=https://maps.google.com/?q=40.7128,-74.0060
   ```

3. **Place URL:**
   ```
   https://yourdomain.com/?maps_url=https://www.google.com/maps/place/Times+Square
   ```

## Troubleshooting

### Paste Button Not Appearing

- Ensure you're on an iOS device
- Make sure no address is currently loaded
- Refresh the app

### Clipboard Access Denied

- Go to Settings → Safari → Advanced → Experimental Features
- Enable "Clipboard API"
- Or use the manual prompt that appears

### Shortcuts Not Working

- Ensure the shortcut URL matches your app's domain exactly
- Check that the shortcut has proper permissions
- Verify the automation trigger conditions

### App Not Opening from Shortcut

- Make sure the app is installed as a PWA
- Check that the URL format is correct
- Verify you're logged into the app

## Best Practice for iOS Users

**Recommended workflow:**

1. Install YatriSahay as a PWA on your home screen
2. Set up the iOS Shortcut (Method 2) for automatic handling
3. Use the Paste button (Method 1) as a fallback
4. Keep the bookmarklet (Method 3) as a backup option

## Future Improvements

For better iOS support, consider:
- Wrapping the PWA as a native app using Capacitor
- Creating a native iOS app with proper URL scheme handling
- Using Universal Links (requires native app)

## Support

For issues specific to iOS:
- Check iOS version compatibility (iOS 14.3+ for PWAs)
- Ensure Safari is up to date
- Verify PWA installation was successful

