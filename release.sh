#!/bin/bash

# Release script for EditMode
# Usage: ./release.sh [version]
# Example: ./release.sh 1.0.1

set -e

# Get version from argument or prompt user
if [ -z "$1" ]; then
    echo "Current version: $(node -p "require('./package.json').version")"
    read -p "Enter new version (e.g., 1.0.1): " VERSION
else
    VERSION=$1
fi

# Validate version format
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in format x.y.z (e.g., 1.0.1)"
    exit 1
fi

echo "Creating release v$VERSION..."

# Update package.json version
npm version $VERSION --no-git-tag-version

# Commit the version change
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ Release v$VERSION created!"
echo "🚀 GitHub Actions will now build and publish the release."
echo "📦 Download links will be available at: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v$VERSION" 