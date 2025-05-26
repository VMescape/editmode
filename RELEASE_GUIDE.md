# Release Guide for EditMode

This guide explains how to automatically build and distribute your EditMode app using GitHub Releases.

## Setup (One-time)

### 1. Update package.json
Make sure to update the GitHub repository information in `package.json`:

```json
"publish": [
  {
    "provider": "github",
    "owner": "YOUR_GITHUB_USERNAME",
    "repo": "YOUR_REPO_NAME"
  }
]
```

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### 2. Enable GitHub Actions
The workflow file `.github/workflows/build.yml` is already set up. GitHub Actions should automatically detect it when you push to your repository.

## Creating a Release

### Method 1: Using the release script (Recommended)
```bash
./release.sh 1.0.1
```

This will:
- Update the version in package.json
- Commit the changes
- Create a git tag
- Push everything to GitHub
- Trigger the GitHub Actions build

### Method 2: Manual release
```bash
# Update version
npm version 1.0.1

# Commit and push
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

## What happens after creating a release

1. **GitHub Actions triggers**: When you push a tag starting with `v`, the workflow runs
2. **Multi-platform builds**: The app is built on:
   - macOS (creates .dmg and .zip files)
   - Windows (creates .exe installer and portable .exe)
   - Linux (creates .AppImage and .deb packages)
3. **Automatic release**: A GitHub release is created with all the build files attached

## Download Links

After the build completes (usually 10-15 minutes), your users can download the app from:

```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest
```

Or for a specific version:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v1.0.1
```

## Direct Download Links for Your Website

You can create direct download links for your website:

### Latest Release Downloads:
- **Windows**: `https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode-Setup-1.0.0.exe`
- **macOS**: `https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode-1.0.0-arm64.dmg`
- **Linux**: `https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode-1.0.0.AppImage`

### Example HTML for your website:
```html
<div class="download-buttons">
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode-Setup.exe" 
     class="download-btn windows">
    Download for Windows
  </a>
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode.dmg" 
     class="download-btn mac">
    Download for macOS
  </a>
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/EditMode.AppImage" 
     class="download-btn linux">
    Download for Linux
  </a>
</div>
```

## Troubleshooting

### Build fails
- Check the GitHub Actions logs in your repository's "Actions" tab
- Ensure all dependencies are properly listed in package.json
- Make sure the icon.png file exists and is valid

### Release not created
- Ensure the tag starts with 'v' (e.g., v1.0.1)
- Check that GitHub Actions has permission to create releases
- Verify the workflow file is in `.github/workflows/build.yml`

### Downloads not working
- Wait for the build to complete (check Actions tab)
- Verify the file names match what's actually generated
- Check that the release is published (not draft)

## Manual Testing

To test the build locally before releasing:

```bash
# Build for your current platform
npm run build

# Build for specific platforms
npm run build:mac
npm run build:win
npm run build:linux
```

The built files will be in the `dist/` directory. 