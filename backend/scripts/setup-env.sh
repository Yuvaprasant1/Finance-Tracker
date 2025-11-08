#!/bin/bash
# Setup Environment Variables for Production
# Usage: source scripts/setup-env.sh

echo "Setting up environment variables for Finance Tracker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your values:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env with your actual credentials"
    exit 1
fi

# Load environment variables from .env file
export $(cat .env | grep -v '^#' | xargs)

# Verify required variables are set
if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI environment variable is not set!"
    echo "Please set it in your .env file"
    exit 1
fi

echo "Environment variables loaded successfully!"
echo "Active profile: ${SPRING_PROFILES_ACTIVE:-dev}"
echo "MongoDB URI: ${MONGODB_URI:0:30}..." # Show first 30 chars only for security

