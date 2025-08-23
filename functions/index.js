const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// API route for token generation
app.get('/api/token', async (req, res) => {
  try {
    // Get API key from Firebase config (old method)
    const apiKey = functions.config().openai?.api_key;
    
    if (!apiKey) {
      console.error('OpenAI API key not found in Firebase config');
      return res.status(500).json({ error: 'OpenAI API key not configured. Please set it using: firebase functions:config:set openai.api_key="your-key"' });
    }

    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2025-06-03',
          modalities: ['text'],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/client')));

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'));
});

// Export the Express app as a Firebase Function
exports.ssr = functions.https.onRequest(app);
