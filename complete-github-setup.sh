#!/bin/bash

# Complete GitHub authentication setup script

set -e

echo "=== Complete GitHub Setup ==="
echo ""

# Ensure SSH key is loaded
eval "$(ssh-agent -s)" > /dev/null 2>&1
ssh-add ~/.ssh/id_ed25519 2>&1 | grep -v "Agent pid" || true

PUBLIC_KEY=$(cat ~/.ssh/id_ed25519.pub)

echo "Your SSH public key:"
echo "$PUBLIC_KEY"
echo ""

# Try to add SSH key using GitHub CLI
if command -v gh &> /dev/null; then
    echo "Attempting to add SSH key via GitHub CLI..."
    if gh auth status &> /dev/null; then
        echo "GitHub CLI is authenticated. Adding SSH key..."
        echo "$PUBLIC_KEY" | gh ssh-key add ~/.ssh/id_ed25519.pub --title "MacBook Pro - $(hostname)" 2>&1 && {
            echo "✓ SSH key added successfully!"
            git remote set-url origin git@github.com:s-sai-s/YatriSahay.git
            echo ""
            echo "Testing connection..."
            ssh -T git@github.com 2>&1 | head -2
            echo ""
            echo "✓ Setup complete! You can now push with: git push -u origin main"
            exit 0
        } || echo "Could not add key via CLI (might already exist)"
    else
        echo "GitHub CLI not authenticated. You can:"
        echo "  1. Run: gh auth login"
        echo "  2. Then run this script again"
        echo ""
    fi
fi

# Manual instructions
echo "=== Manual Setup Required ==="
echo ""
echo "Since automated setup requires authentication, please do one of the following:"
echo ""
echo "METHOD 1: Add SSH Key via GitHub Website (Easiest)"
echo "  1. Go to: https://github.com/settings/keys"
echo "  2. Click 'New SSH key'"
echo "  3. Title: MacBook Pro"
echo "  4. Paste this key:"
echo ""
echo "     $PUBLIC_KEY"
echo ""
echo "  5. Click 'Add SSH key'"
echo "  6. Then run: git push -u origin main"
echo ""
echo "METHOD 2: Use GitHub CLI"
echo "  1. Run: gh auth login"
echo "  2. Follow the prompts"
echo "  3. Then run this script again: ./complete-github-setup.sh"
echo ""
echo "METHOD 3: Use Personal Access Token (HTTPS)"
echo "  1. Create token: https://github.com/settings/tokens"
echo "  2. Select 'repo' scope"
echo "  3. Copy the token"
echo "  4. Run: git remote set-url origin https://github.com/s-sai-s/YatriSahay.git"
echo "  5. When pushing, use token as password"
echo ""

