#!/bin/bash

# Vault PKI Demo Container Startup Script
# This script helps you set up and run the containerized demo

set -e

echo "🚀 HashiCorp Vault PKI Demo - Container Setup"
echo "============================================="

# Check for required tools
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your Vault details:"
    echo "   - VAULT_ADDR: Your Vault server URL"
    echo "   - VAULT_TOKEN: Your Vault authentication token"
    echo "   - VAULT_NAMESPACE: Your Vault namespace (if applicable)"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
fi

# Validate environment variables
echo "🔍 Validating environment configuration..."
source .env

if [ -z "$VAULT_ADDR" ] || [ "$VAULT_ADDR" = "https://your-vault-cluster.hashicorp.cloud:8200" ]; then
    echo "❌ Please set VAULT_ADDR in .env file"
    exit 1
fi

if [ -z "$VAULT_TOKEN" ] || [ "$VAULT_TOKEN" = "your-vault-token-here" ]; then
    echo "❌ Please set VAULT_TOKEN in .env file"
    exit 1
fi

echo "✅ Environment configuration looks good!"

# Build and start the container
echo ""
echo "🏗️  Building and starting the container..."

# Check if we should use docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

$COMPOSE_CMD down 2>/dev/null || true
$COMPOSE_CMD up --build -d

echo ""
echo "⏳ Waiting for the application to start..."
sleep 10

# Check if container is running
if $COMPOSE_CMD ps | grep -q "Up"; then
    echo "✅ Container is running!"
    echo ""
    echo "🌐 Access the demo at: http://localhost:3020"
    echo ""
    echo "📊 Available interfaces:"
    echo "   • Interactive Terminal: http://localhost:3020 (default tab)"
    echo "   • PKI Diagrams: Click the 'PKI Lifecycle Diagrams' tab"
    echo ""
    echo "🔧 Management commands:"
    echo "   • View logs: $COMPOSE_CMD logs -f"
    echo "   • Stop demo: $COMPOSE_CMD down"
    echo "   • Restart: $COMPOSE_CMD restart"
    echo ""
    echo "Happy demoing! 🎉"
else
    echo "❌ Container failed to start. Check the logs:"
    $COMPOSE_CMD logs
    exit 1
fi
