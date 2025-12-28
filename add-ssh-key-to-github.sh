#!/bin/bash

# Script to add SSH key to GitHub
# Usage: ./add-ssh-key-to-github.sh [GITHUB_TOKEN]

PUBLIC_KEY=$(cat ~/.ssh/id_ed25519.pub)
KEY_TITLE="MacBook Pro - $(hostname)"

if [ -z "$1" ]; then
    echo "To add your SSH key to GitHub, you have two options:"
    echo ""
    echo "OPTION 1: Add via GitHub Website (Easiest)"
    echo "1. Copy your public key:"
    echo ""
    echo "$PUBLIC_KEY"
    echo ""
    echo "2. Go to: https://github.com/settings/keys"
    echo "3. Click 'New SSH key'"
    echo "4. Paste the key above and save"
    echo ""
    echo "OPTION 2: Add via API (Requires Personal Access Token)"
    echo "1. Create a token at: https://github.com/settings/tokens"
    echo "2. Run: ./add-ssh-key-to-github.sh YOUR_TOKEN"
    exit 0
fi

GITHUB_TOKEN=$1

echo "Adding SSH key to GitHub..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/keys \
  -d "{\"title\":\"$KEY_TITLE\",\"key\":\"$PUBLIC_KEY\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "422" ]; then
    if [ "$HTTP_CODE" = "422" ]; then
        echo "Key might already be added (or duplicate). Testing connection..."
    else
        echo "SSH key added successfully!"
    fi
    echo ""
    echo "Testing SSH connection..."
    ssh -T git@github.com 2>&1
else
    echo "Error adding key. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
fi

