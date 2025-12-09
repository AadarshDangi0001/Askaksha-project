#!/bin/bash

# Start Translation API Server
# This script starts the Python translation service

echo "🚀 Starting Translation API Server..."

# Navigate to translator directory
cd "$(dirname "$0")"

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the API server
echo "✅ Starting translation API on port 5001..."
python3 api.py
