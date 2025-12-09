#!/bin/bash

# AskKaksha WhatsApp Bot - Quick Start Script

echo "🤖 Starting AskKaksha WhatsApp Bot..."
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create .env file with:"
    echo "  GEMINI_API_KEY=your_key_here"
    echo "  MONGO_URI=your_mongodb_uri"
    echo "  JWT_SECRET=your_secret"
    echo ""
    exit 1
fi

# Check GEMINI_API_KEY
if ! grep -q "GEMINI_API_KEY=" .env; then
    echo "⚠️  WARNING: GEMINI_API_KEY not found in .env"
    echo ""
fi

echo "✅ Environment check complete"
echo ""
echo "📱 Starting server with WhatsApp Bot integration..."
echo ""
echo "NEXT STEPS:"
echo "1. Wait for QR code to appear in terminal"
echo "2. Open WhatsApp on your phone"
echo "3. Go to Settings → Linked Devices"
echo "4. Tap 'Link a Device'"
echo "5. Scan the QR code"
echo ""
echo "Bot will respond to messages containing 'askaksha'"
echo "Example: 'askaksha what is AI?'"
echo ""
echo "========================================"
echo ""

# Start the server
npm start
