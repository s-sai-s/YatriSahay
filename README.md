# YatriSahay - Travel Companion PWA

A Progressive Web App (PWA) for cab booking with Google Maps integration, built with Node.js and Express.js.

## Features

- 🔐 Google OAuth authentication
- 🗺️ Google Maps integration with address geocoding
- 🚕 Uber and Rapido deep link booking
- 📱 Native-wrapped PWA support
- 🔗 Deep link handling from mobile Google Maps

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth credentials (Client ID and Client Secret)
- Google Geocoding API key (restricted to Geocoding API only)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity Services)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/auth/google/callback` (for development)
   - **Important:** This must match exactly: `http://localhost:3000/auth/google/callback`
   - For production, add your production URL: `https://yourdomain.com/auth/google/callback`
7. Copy the Client ID and Client Secret
8. The OAuth flow will redirect to this callback URL after successful authentication

### 3. Get Google Geocoding API Key

1. In the same Google Cloud Console project
2. Enable the "Geocoding API"
3. Go to "Credentials" → "Create Credentials" → "API Key" (or use existing)
4. Copy the API key
5. (Recommended) Restrict the API key to "Geocoding API" only for security

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=your_random_session_secret_here
API_KEY=your_google_geocoding_api_key_here
PORT=3000
NODE_ENV=development
```

**Important:** 
- Generate a random string for `SESSION_SECRET`. You can use:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- The `API_KEY` is used with the `key` parameter in the Google Geocoding API requests.
- **For OAuth redirect_uri_mismatch errors:** Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/auth/google/callback` (or set `CALLBACK_URL` in `.env` if using a different port/domain)

### 5. Create PWA Icons

You need to create two icon files in the `public` directory:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

**Option 1: Use the built-in generator**
1. Open `public/create-icons.html` in your browser
2. Click the download buttons to save the icons
3. Place them in the `public/` directory

**Option 2: Use an image editor**
- Create icons with your preferred image editor
- Ensure they are exactly 192x192 and 512x512 pixels
- Save them as `icon-192.png` and `icon-512.png` in the `public/` directory

### 6. Run the Application

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

### Opening from Google Maps (Mobile)

1. Share a location from Google Maps
2. Select "YatriSahay" from the share options (if configured)
3. The app will open with the address pre-filled
4. Book Uber or Rapido directly

### Direct Access

1. Login with your Google account
2. Open the app directly - only "Open Google Maps" button will be active
3. Uber and Rapido buttons will be disabled until an address is loaded from a link

## Mobile PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Android (Chrome)
1. Open the app in Chrome
2. Look for the "📱 Install App" button (appears automatically)
3. Or tap the menu (three dots) → "Add to Home Screen" or "Install App"
4. See **[ANDROID_PWA_SETUP.md](ANDROID_PWA_SETUP.md)** for detailed setup and troubleshooting

## Deep Link Configuration

### Opening Google Maps Links from WhatsApp/SMS

The app can open Google Maps links shared via WhatsApp, SMS, or other messaging apps. See **[DEEP_LINK_SETUP.md](DEEP_LINK_SETUP.md)** for detailed setup instructions.

**Quick Setup:**
- **Android:** Install as PWA, tap Google Maps link, select "Open with YatriSahay"
- **iOS:** See **[IOS_SETUP.md](IOS_SETUP.md)** - iOS PWAs have limitations, but workarounds are available (Paste button, Shortcuts, etc.)

**URL Formats Supported:**
- `/?maps_url=ENCODED_GOOGLE_MAPS_URL`
- `/?q=ADDRESS`
- `/?url=GOOGLE_MAPS_URL`
- `/?text=GOOGLE_MAPS_URL` (for share intents)

### For Native Wrapper (Optional)

To handle Google Maps links automatically when wrapping as a native app:

#### Android (Capacitor/Cordova)
Add to `AndroidManifest.xml`:
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="maps.google.com" />
    <data android:scheme="https" android:host="www.google.com" android:pathPrefix="/maps" />
</intent-filter>
```

#### iOS (Capacitor/Cordova)
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

## Project Structure

```
YatriSahay/
├── server.js              # Express server with OAuth and API routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
├── public/
│   ├── index.html         # Home page
│   ├── login.html         # Login page
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   ├── icon-192.png      # PWA icon (192x192)
│   └── icon-512.png      # PWA icon (512x512)
└── README.md             # This file
```

## API Endpoints

- `GET /login` - Login page
- `GET /` - Home page (requires authentication)
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /logout` - Logout user
- `GET /api/user` - Get current user info (requires authentication)
- `POST /api/geocode` - Geocode an address (requires authentication and API_KEY in .env)
- `GET /maps` - Handle deep links from Google Maps (requires authentication)

## Troubleshooting

### OAuth not working / redirect_uri_mismatch error
- **Most common issue:** The redirect URI in Google Cloud Console must match EXACTLY what the app sends
- Verify your Google OAuth credentials (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) are correct in `.env`
- Check the console output when starting the server - it will show the callback URL being used
- Ensure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/auth/google/callback` (for development)
- Common mismatches to check:
  - `http://` vs `https://` (use `http://` for localhost)
  - Trailing slashes (should NOT have trailing slash)
  - Port number must match (default is 3000)
  - Case sensitivity (should be lowercase)
- If using a different port, set `CALLBACK_URL` in `.env` to match exactly
- Check that Google+ API (or Google Identity Services) is enabled in Google Cloud Console
- Verify the OAuth consent screen is configured in Google Cloud Console

### Geocoding not working
- Verify your `API_KEY` is set correctly in the `.env` file
- Ensure Geocoding API is enabled in Google Cloud Console
- Check that the API key is not restricted to other APIs (should be restricted to Geocoding API only)
- Verify the API key has proper billing/quota setup in Google Cloud Console

### Session issues
- Ensure `SESSION_SECRET` is set in `.env` file
- Use a strong random string for `SESSION_SECRET` (see setup instructions)

### Deep links not working
- Ensure the app is installed as a PWA
- Check that intent filters are configured (for native wrapper)
- Verify the URL format matches expected patterns

## License

ISC

