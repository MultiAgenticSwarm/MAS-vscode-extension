#!/bin/bash

# Demo script for Python Todo App
# Created by MultiAgent Swarm VS Code Extension

echo "🐍 Python Todo App Demo"
echo "========================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ to run this demo."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ app.py not found. Please run this script from the todo-app directory."
    exit 1
fi

echo "✅ Todo app files found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Run tests
echo ""
echo "🧪 Running tests..."
python3 -m pytest test_app.py -v

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All tests passed!"

# Start the Flask app
echo ""
echo "🚀 Starting Flask application..."
echo "   Open your browser and go to: http://localhost:5000"
echo "   Press Ctrl+C to stop the server"
echo ""

python3 app.py
