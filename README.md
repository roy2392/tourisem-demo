# Israeli Tourism Chatbot 🇮🇱

An AI-powered tourism assistant for the Israeli Ministry of Tourism, featuring RAG (Retrieval Augmented Generation) with comprehensive tourism knowledge base.

## Features

- 🤖 **Context-Aware Chatbot** - Maintains conversation history
- 🏛️ **Government Design** - Matches gov.il official styling
- 📱 **Mobile Optimized** - Responsive design for all devices
- 🔍 **RAG System** - Retrieval Augmented Generation with tourism database
- 🕒 **Real-Time Hours** - Opening hours for major attractions
- 💰 **Pricing Info** - Ticket prices and free attractions
- 🗺️ **Location Data** - Addresses and directions
- 🍽️ **Food & Culture** - Local cuisine and markets
- 🚌 **Transportation** - Public transport and pricing

## Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set Environment Variable**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `GEMINI_API_KEY` with your Google AI Studio API key

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your environment variables

## License

MIT License - Built for the Israeli Ministry of Tourism digital services.