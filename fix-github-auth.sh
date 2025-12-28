#!/bin/bash

# Comprehensive script to fix GitHub authentication

echo "=== GitHub Authentication Fix ==="
echo ""

# Check current remote
echo "Current remote URL:"
git remote -v
echo ""

# Option 1: Try SSH (if key is added to GitHub)
echo "Attempting SSH setup..."
eval "$(ssh-agent -s)" > /dev/null 2>&1
ssh-add ~/.ssh/id_ed25519 2>&1

if ssh -o StrictHostKeyChecking=no -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✓ SSH authentication working!"
    git remote set-url origin git@github.com:s-sai-s/YatriSahay.git
    echo "Switched to SSH. Try: git push -u origin main"
    exit 0
fi

echo "SSH key not added to GitHub yet."
echo ""

# Option 2: Setup HTTPS with Personal Access Token
echo "Setting up HTTPS authentication..."
git remote set-url origin https://github.com/s-sai-s/YatriSahay.git

echo ""
echo "To complete setup, choose one:"
echo ""
echo "A) Add SSH key to GitHub (Recommended):"
echo "   1. Run: ./add-ssh-key-to-github.sh"
echo "   2. Follow the instructions"
echo ""
echo "B) Use Personal Access Token with HTTPS:"
echo "   1. Create token: https://github.com/settings/tokens"
echo "   2. Select 'repo' scope"
echo "   3. Copy the token"
echo "   4. When pushing, use token as password (username: s-sai-s)"
echo ""
echo "C) Use GitHub CLI (if installed):"
echo "   1. Install: brew install gh"
echo "   2. Run: gh auth login"
echo ""

