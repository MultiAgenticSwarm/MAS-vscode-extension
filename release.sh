#!/bin/bash

# MultiAgent Swarm Extension Release Script
# This script automates the release process for the VS Code extension

set -e

echo "🤖 MultiAgent Swarm Extension Release Script"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the extension root directory."
    exit 1
fi

# Extract version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $VERSION"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -f *.vsix

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

# Run linter
echo "🔍 Running linter..."
npm run lint

# Package extension
echo "📦 Packaging extension..."
vsce package

# Get the generated .vsix filename
VSIX_FILE="multiagent-swarm-${VERSION}.vsix"

if [ -f "$VSIX_FILE" ]; then
    echo "✅ Extension packaged successfully: $VSIX_FILE"
    echo "📊 Package size: $(du -h "$VSIX_FILE" | cut -f1)"
    
    # Create release directory
    mkdir -p releases
    cp "$VSIX_FILE" releases/
    
    echo "📁 Copied to releases/ directory"
    
    # Test installation (optional)
    read -p "🔧 Would you like to test install the extension? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🧪 Installing extension for testing..."
        code --install-extension "$VSIX_FILE" --force
        echo "✅ Extension installed. You can now test it in VS Code."
    fi
    
    echo ""
    echo "🎉 Release process completed!"
    echo "📄 Files generated:"
    echo "   - $VSIX_FILE (main package)"
    echo "   - releases/$VSIX_FILE (backup)"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Test the extension thoroughly"
    echo "   2. Create a GitHub release"
    echo "   3. Upload the .vsix file to the release"
    echo "   4. Publish to VS Code Marketplace (optional)"
    echo ""
    echo "🔗 Useful commands:"
    echo "   Install: code --install-extension $VSIX_FILE"
    echo "   Uninstall: code --uninstall-extension MultiAgenticSwarm.multiagent-swarm"
    
else
    echo "❌ Error: Failed to create extension package"
    exit 1
fi
