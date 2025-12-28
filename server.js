require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve paths correctly for both local and Vercel environments
// In Vercel, __dirname points to the function directory, so we use process.cwd()
const getPublicPath = () => {
  if (process.env.VERCEL) {
    // In Vercel, files are in the project root
    return path.join(process.cwd(), 'public');
  }
  // Local development
  return path.join(__dirname, 'public');
};

const publicPath = getPublicPath();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with proper cache headers
app.use(express.static(publicPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Session configuration
// Use secure cookies in production (Vercel uses HTTPS)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Use secure cookies in production (HTTPS required)
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Help with OAuth redirects
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
// Use full absolute URL to match Google Cloud Console exactly
// The callback URL must match EXACTLY what's configured in Google Cloud Console
// For development: http://localhost:3000/auth/google/callback
const getCallbackURL = () => {
  // Use environment variable if set (recommended for production)
  if (process.env.CALLBACK_URL) {
    return process.env.CALLBACK_URL;
  }
  // For Vercel, use VERCEL_URL if available
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/auth/google/callback`;
  }
  // Default to localhost for development
  // This must match EXACTLY what's in Google Cloud Console
  const port = PORT;
  return `http://localhost:${port}/auth/google/callback`;
};

const callbackURL = getCallbackURL();
console.log('OAuth Callback URL configured:', callbackURL);
console.log('Make sure this matches EXACTLY in Google Cloud Console redirect URIs');

// Initialize Passport Google Strategy with error handling
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. OAuth will not work.');
} else {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    // Store user profile in session
    return done(null, profile);
  }));
}

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Check authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // Store the original URL they were trying to access
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

// Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=auth_failed',
    failureMessage: true
  }),
  (req, res) => {
    // Successful authentication
    // Check if there's a return URL stored in session
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    
    // Redirect to home or original destination
    res.redirect(returnTo);
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/login');
  });
});

// User info API endpoint
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json({
    email: req.user.emails?.[0]?.value || req.user.displayName || 'User',
    name: req.user.displayName || 'User',
    photo: req.user.photos?.[0]?.value || null
  });
});

// Geocoding API endpoint
app.post('/api/geocode', isAuthenticated, async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured. Please set API_KEY in .env file' });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: apiKey
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address;
      
      res.json({
        success: true,
        lat: location.lat,
        lng: location.lng,
        formattedAddress: formattedAddress,
        addressName: response.data.results[0].address_components[0]?.long_name || formattedAddress
      });
    } else {
      res.status(400).json({ 
        error: 'Address not found',
        status: response.data.status 
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding service error' });
  }
});

// Serve login page
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.sendFile(path.join(publicPath, 'login.html'), (err) => {
    if (err) {
      console.error('Error serving login.html:', err);
      res.status(500).send('Error loading login page');
    }
  });
});

// Serve home page
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading home page');
    }
  });
});

// Handle deep links - redirect Google Maps URLs to home with query params
// This route handles links opened from WhatsApp, SMS, etc.
app.get('/maps', isAuthenticated, (req, res) => {
  const mapsUrl = req.query.url || req.query.q || req.query.text || '';
  if (mapsUrl) {
    res.redirect(`/?maps_url=${encodeURIComponent(mapsUrl)}`);
  } else {
    res.redirect('/');
  }
});

// Handle share target and external links
// When app is opened from external apps (WhatsApp, SMS, etc.)
app.get('/open', isAuthenticated, (req, res) => {
  const mapsUrl = req.query.url || req.query.text || req.query.maps_url || '';
  if (mapsUrl) {
    res.redirect(`/?maps_url=${encodeURIComponent(mapsUrl)}`);
  } else {
    res.redirect('/');
  }
});

// Serve service worker with proper headers
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(publicPath, 'sw.js'), {
    headers: { 
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache'
    }
  });
});

// Serve manifest.json with proper content type
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(publicPath, 'manifest.json'), {
    headers: { 
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Only listen on port if not in Vercel environment
// Vercel will handle the serverless function invocation
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Public path: ${publicPath}`);
  });
}

// Export the app for Vercel
module.exports = app;

