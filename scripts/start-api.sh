#!/bin/bash

# Start the API server with Loki logging
echo "Starting API server with Loki logging..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from env-example-relational..."
    cp env-example-relational .env
    echo "⚠️  Please configure your database connection in .env file"
fi

# Check if Loki is running
if ! curl -s http://localhost:3100/ready > /dev/null; then
    echo "❌ Loki is not running. Please start it first:"
    echo "   docker-compose up -d"
    exit 1
fi

echo "✅ Loki is ready"
echo "🚀 Starting API server..."

# Start the API server
npm run start:dev
