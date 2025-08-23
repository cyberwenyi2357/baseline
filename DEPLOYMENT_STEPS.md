# Quick Deployment Steps

## 1. Set Environment Variable

Set your OpenAI API key in Firebase Functions:

**Option A: Using Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/project/intersense-baseline/functions/config)
2. Navigate to Functions → Configuration
3. Add environment variable: `OPENAI_API_KEY` with your actual API key value

**Option B: Using Firebase CLI**
```bash
firebase functions:config:set openai.api_key="your-actual-openai-api-key"
```

## 2. Deploy

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

## 3. Your app will be available at:
`https://intersense-baseline.web.app`

## Files Created/Updated:
- ✅ `firebase.json` - Firebase configuration
- ✅ `.firebaserc` - Project configuration  
- ✅ `functions/package.json` - Functions dependencies
- ✅ `functions/index.js` - Cloud Function handler
- ✅ `deploy.sh` - Deployment script
- ✅ Updated `client/components/App.jsx` - API endpoint changed to `/api/token`
- ✅ Updated `package.json` - Build scripts optimized for Firebase
