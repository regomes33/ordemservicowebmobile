#!/bin/bash

# Navigate to frontend directory
cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully!"
    echo ""
    echo "To start the development server, run:"
    echo "  npm run dev"
else
    echo "Error installing dependencies"
    exit 1
fi
