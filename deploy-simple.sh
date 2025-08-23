#!/bin/bash

echo "🚀 Simple Firebase Hosting Deployment..."

# Build the client
echo "📦 Building client..."
npm run build

# Deploy only hosting (no functions)
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://intersense-baseline.web.app"
echo ""
echo "⚠️  Note: You still need to set up an API endpoint for /token calls."
echo "   See API_SETUP.md for options."
