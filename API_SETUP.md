# Simple API Setup

Since Firebase Hosting is static-only, we need a simple way to handle your `/token` API calls. Here are the easiest options:

## Option 1: Pipedream (Free, No Setup)

1. Go to [Pipedream](https://pipedream.com) and create a free account
2. Create a new HTTP endpoint
3. Use this code in the Pipedream workflow:

```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  name: "OpenAI Token Generator",
  version: "0.0.1",
  props: {
    openai_api_key: {
      type: "string",
      label: "OpenAI API Key",
      secret: true,
    },
  },
  async run({steps, $}) {
    const response = await axios($, {
      method: "POST",
      url: "https://api.openai.com/v1/realtime/sessions",
      headers: {
        Authorization: `Bearer ${this.openai_api_key}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "gpt-4o-realtime-preview-2025-06-03",
        modalities: ['text'],
      },
    })
    
    return response.data
  },
})
```

4. Set your OpenAI API key in the Pipedream props
5. Copy the endpoint URL and update your app

## Option 2: Update Your App to Use Pipedream

Once you have the Pipedream endpoint, update your app:

```javascript
// In client/components/App.jsx, change this line:
const tokenResponse = await fetch("YOUR_PIPEDREAM_ENDPOINT_URL");
```

## Option 3: Use a Different Hosting Service

If you want to keep your Express server, consider:
- **Vercel**: Supports Express.js out of the box
- **Railway**: Easy deployment with environment variables
- **Render**: Free tier with Express support

## Option 4: Keep Firebase Functions (Current Setup)

If you want to stick with Firebase Functions, just set the environment variable:
1. Go to Firebase Console → Functions → Configuration
2. Add: `OPENAI_API_KEY` = your actual API key
3. Redeploy: `firebase deploy --only functions`
