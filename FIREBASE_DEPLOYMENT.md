# Firebase Deployment Guide

This guide will help you deploy your React + Express application to Firebase using the Blaze plan.

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Account**: You already have a Blaze account, which is perfect!

3. **Firebase Project**: Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)

## Setup Steps

### 1. Initialize Firebase in your project

```bash
firebase login
firebase init
```

When prompted:
- Select "Hosting" and "Functions"
- Choose your Firebase project
- For hosting public directory, enter: `dist/client`
- Configure as a single-page app: `Yes`
- Set up automatic builds: `No` (we'll handle this manually)

### 2. Update Firebase Project ID

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 3. Set Environment Variables

Set your OpenAI API key in Firebase Functions:

```bash
firebase functions:config:set openai.api_key="your-openai-api-key"
```

Or set it directly in the Firebase Console:
1. Go to Firebase Console → Functions → Configuration
2. Add environment variable: `OPENAI_API_KEY` with your API key value

### 4. Deploy

Run the deployment script:

```bash
./deploy.sh
```

Or deploy manually:

```bash
# Build the client
npm run build

# Install Functions dependencies
cd functions && npm install && cd ..

# Deploy to Firebase
firebase deploy
```

## What's Deployed

- **Firebase Hosting**: Serves your React app from `dist/client`
- **Firebase Functions**: Handles your API routes (like `/api/token`) and serves the app

## Configuration Files Created

- `firebase.json`: Firebase configuration
- `.firebaserc`: Project configuration
- `functions/`: Cloud Functions directory
  - `package.json`: Functions dependencies
  - `index.js`: Main function handler

## Important Notes

1. **Blaze Plan Benefits**: With Blaze, you get:
   - Higher function execution limits
   - Better performance
   - More generous quotas

2. **API Routes**: Your `/token` endpoint is now available at `/api/token`

3. **Environment Variables**: Make sure to set `OPENAI_API_KEY` in Firebase Functions configuration

4. **Costs**: Blaze plan charges for usage, but you get a generous free tier first

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all dependencies are installed
   ```bash
   npm install
   ```

2. **Function Deployment Errors**: Check the Functions logs
   ```bash
   firebase functions:log
   ```

3. **Environment Variables**: Verify they're set correctly
   ```bash
   firebase functions:config:get
   ```

### Local Testing

Test locally before deploying:

```bash
# Start Firebase emulator
firebase emulators:start

# Build and test
npm run build
```

## Next Steps

After deployment, your app will be available at:
`https://your-project-id.web.app`

You can also set up a custom domain in the Firebase Console if needed.

