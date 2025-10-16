#!/bin/bash
# Script to add GitHub Actions secrets to repository
# Run this with a GitHub token that has 'repo' and 'admin:repo_hook' permissions

set -e

echo "🔐 Adding GitHub Actions Secrets to elimu_smart repository"
echo "============================================================"
echo ""

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub CLI not authenticated. Please run: gh auth login"
    exit 1
fi

echo "📝 Repository: Iam-Were/elimu_smart"
echo ""

# GH_TOKEN
echo "1️⃣  Adding GH_TOKEN..."
echo "ghu_NRe7HwlDuxhJGDv8uCkv40DKC7nJY93XPz7H" | gh secret set GH_TOKEN -R Iam-Were/elimu_smart || echo "⚠️  Failed to add GH_TOKEN (may need admin permissions)"

# VPS_HOST
echo "2️⃣  Adding VPS_HOST..."
echo "145.239.42.121" | gh secret set VPS_HOST -R Iam-Were/elimu_smart || echo "⚠️  Failed to add VPS_HOST"

# VPS_USER
echo "3️⃣  Adding VPS_USER..."
echo "root" | gh secret set VPS_USER -R Iam-Were/elimu_smart || echo "⚠️  Failed to add VPS_USER"

# VPS_SSH_KEY
echo "4️⃣  Adding VPS_SSH_KEY..."
cat ~/.ssh/id_ed25519 | gh secret set VPS_SSH_KEY -R Iam-Were/elimu_smart || echo "⚠️  Failed to add VPS_SSH_KEY"

# GH_MODELS_API
echo "5️⃣  Adding GH_MODELS_API..."
echo "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" | gh secret set GH_MODELS_API -R Iam-Were/elimu_smart || echo "⚠️  Failed to add GH_MODELS_API"

echo ""
echo "============================================================"
echo "✅ Secret addition complete!"
echo ""
echo "📋 To verify secrets were added, go to:"
echo "   https://github.com/Iam-Were/elimu_smart/settings/secrets/actions"
echo ""
