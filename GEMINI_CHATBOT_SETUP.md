# Gemini LLM Chatbot Setup Guide

## Overview
The support chatbot has been updated to use **Google Gemini 2.0 Flash** LLM for intelligent, context-aware responses.

## Setup Steps

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **"Create API Key"**
3. Select or create a Google Cloud project
4. Copy the generated API key

### 2. Add to Environment Variables

Add the following to your `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual API key from step 1.

### 3. Verify Setup

The chatbot will now:
- Use Gemini 2.0 Flash model for responses
- Maintain context about Agnishila products
- Provide intelligent, natural responses
- Fall back gracefully if API is unavailable

## API Endpoint

The chatbot uses the following endpoint:
- **Route**: `/api/chatbot`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "message": "user question",
    "context": "optional system context"
  }
  ```

## Features

✅ Real-time AI responses using Gemini 2.0 Flash
✅ Context-aware support for Agnishila products
✅ Loading states and error handling
✅ Fallback to quick questions if API fails
✅ Responsive design for mobile and desktop

## Pricing

Google Gemini API offers:
- **Free tier**: 15 requests per minute
- **Paid tier**: Pay-as-you-go pricing

Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates.

## Troubleshooting

### "Gemini API key not configured"
- Ensure `GEMINI_API_KEY` is set in `.env`
- Restart the development server after adding the key

### "Failed to get response from Gemini"
- Verify your API key is valid
- Check your API quota hasn't been exceeded
- Ensure the API is enabled in your Google Cloud project

### Slow responses
- Gemini 2.0 Flash is optimized for speed
- Check your internet connectio