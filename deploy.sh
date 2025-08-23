#!/bin/bash

echo "🚀 Starting Firebase deployment..."

# Build the client
echo "📦 Building client..."
npm run build

# Install Firebase Functions dependencies
echo "📦 Installing Functions dependencies..."
cd functions && npm install && cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"

