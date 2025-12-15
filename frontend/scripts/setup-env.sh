#!/bin/bash

# Environment Setup Script for Agriculture Platform
# This script helps you set up your environment variables

set -e

echo "🌾 Agriculture Platform - Environment Setup"
echo "=========================================="
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 0
    fi
    echo "📝 Backing up existing .env.local to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Copy from example
if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
else
    echo "❌ Error: .env.example not found!"
    exit 1
fi

echo ""
echo "📝 Now let's configure your API keys..."
echo ""

# Function to prompt for API key
prompt_for_key() {
    local key_name=$1
    local description=$2
    local url=$3
    local required=$4
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔑 $key_name"
    echo "   $description"
    if [ -n "$url" ]; then
        echo "   Get it from: $url"
    fi
    echo ""
    
    if [ "$required" = "true" ]; then
        echo "   [REQUIRED]"
    else
        echo "   [OPTIONAL - Press Enter to skip]"
    fi
    
    read -p "   Enter value: " value
    
    if [ -n "$value" ]; then
        # Escape special characters for sed
        escaped_value=$(printf '%s\n' "$value" | sed -e 's/[\/&]/\\&/g')
        # Update .env.local
        if grep -q "^$key_name=" .env.local; then
            sed -i.bak "s|^$key_name=.*|$key_name=$escaped_value|" .env.local && rm .env.local.bak 2>/dev/null || true
        else
            echo "$key_name=$escaped_value" >> .env.local
        fi
        echo "   ✅ Set $key_name"
    else
        if [ "$required" = "true" ]; then
            echo "   ⚠️  Warning: This key is required for the app to work!"
        else
            echo "   ⏭️  Skipped"
        fi
    fi
    echo ""
}

# Prompt for essential API keys
echo "🤖 AI/ML Configuration"
echo ""

prompt_for_key \
    "GEMINI_API_KEY" \
    "Google Gemini AI for plant analysis & chat (FREE)" \
    "https://aistudio.google.com/app/apikey" \
    "true"

prompt_for_key \
    "OPENROUTER_API_KEY" \
    "OpenRouter for AI fallback (optional but recommended)" \
    "https://openrouter.ai/keys" \
    "false"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "ℹ️  Supabase/Database keys are managed by Vercel integration"
echo "   Check your v0 Vars section or Vercel dashboard"
echo ""

# Final instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review .env.local and add any missing Supabase keys"
echo "2. Run validation: npx tsx scripts/validate-env.ts"
echo "3. Start dev server: npm run dev"
echo ""
echo "📚 For more help, see:"
echo "   - ENVIRONMENT_SETUP.md"
echo "   - API_KEYS_AUDIT.md"
echo ""
echo "🔒 Security reminder: NEVER commit .env.local to git!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
