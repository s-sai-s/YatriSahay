# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=generate_a_random_string_here
API_KEY=your_google_geocoding_api_key_here
PORT=3000
NODE_ENV=development
```

### Getting Google OAuth Credentials:
1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Enable Google+ API (or Google Identity Services)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add redirect URI: `http://localhost:3000/auth/google/callback`
7. Copy the Client ID and Client Secret

### Getting Geocoding API Key:
1. In the same Google Cloud Console project
2. Enable "Geocoding API"
3. Go to "Credentials" → "Create Credentials" → "API Key"
4. Copy the API key
5. (Recommended) Restrict the key to "Geocoding API" only for security

### Generate Session Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Note:** The `API_KEY` is used with the `key` parameter in Google Geocoding API requests.

## 3. Create PWA Icons

Open `public/create-icons.html` in your browser and download the icons, or create your own:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

## 4. Run the App

```bash
npm start
```

Visit: http://localhost:3000

## 5. Test the App

1. Login with your Google account
2. Open the app directly - only "Open Google Maps" button should be active
3. Try opening with a Google Maps link: `http://localhost:3000/?maps_url=https://maps.google.com/?q=New+York`
4. The address should be geocoded and Uber/Rapido buttons should be enabled

## Mobile Testing

1. Deploy to a server (or use ngrok for local testing)
2. Open on mobile device
3. Add to home screen (PWA install)
4. Share a location from Google Maps and select your app

