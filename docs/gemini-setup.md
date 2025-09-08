# Google Gemini API Setup Guide

## 🚀 Get Your Free Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Sign In
- Use your Google account
- Accept the terms of service

### Step 3: Create API Key
- Click "Create API Key"
- Choose "Create API key in new project" (recommended)
- Copy your API key

### Step 4: Add to Your App
```bash
# In your server/.env file, add:
GEMINI_API_KEY=your_api_key_here
LLM_PROVIDER=gemini
```

## 💰 Pricing (As of 2024)

### Gemini Pro (Free Tier)
- **60 requests per minute**
- **1,500 requests per day**
- **FREE** for development and testing

### Gemini 1.5 Pro
- More powerful model
- **2 requests per minute** (free tier)
- **50 requests per day** (free tier)

### Gemini 1.5 Flash
- Faster responses
- **15 requests per minute** (free tier)
- **1,500 requests per day** (free tier)

## 🎯 Why Choose Gemini?

### ✅ Advantages
- **Free tier** with generous limits
- **Fast responses** (especially Flash model)
- **Large context window** (1M+ tokens)
- **Multimodal** (text, images, video)
- **No credit card required** for free tier

### ⚠️ Considerations
- Newer API (less mature ecosystem)
- Rate limits on free tier
- Geographic restrictions in some regions

## 🧪 Test Your Setup

```bash
cd server
node test-gemini.js
```

This will verify your API key and show available models.

## 🔄 Switch Between Providers

Use the settings button (⚙️) in the bottom-right of the app to switch between:
- **OpenAI**: Best for production, requires billing
- **Anthropic**: Great for complex reasoning
- **Gemini**: Free tier, fast responses

## 🛠️ Troubleshooting

### "API_KEY_INVALID"
- Double-check your API key
- Make sure it's properly copied
- Regenerate the key if needed

### "Rate Limit Exceeded"
- You've hit the free tier limits
- Wait for the rate limit to reset
- Consider upgrading to paid tier

### "Service Not Available"
- Gemini may not be available in your region
- Try using a VPN
- Switch to OpenAI or Anthropic

## 🌟 Pro Tips

1. **Start with Gemini Flash** for fast testing
2. **Use Gemini Pro** for better quality
3. **Switch providers** based on your needs
4. **Monitor usage** at https://makersuite.google.com/
5. **Combine providers** for different use cases

Happy generating! 🎉
