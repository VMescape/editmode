# Installation Guide for EditMode

EditMode is currently distributed as an unsigned application to keep it free. This means you may see security warnings during installation. **This is normal and safe** - the warnings appear because we haven't purchased expensive code signing certificates.

## 🪟 Windows Installation

### Method 1: Using the Installer (Recommended)
1. Download `EditMode-Setup.exe`
2. **You'll see a "Windows protected your PC" warning**
3. Click **"More info"**
4. Click **"Run anyway"**
5. Follow the installation wizard

### Method 2: Portable Version
1. Download `EditMode-Portable.exe`
2. Right-click the file and select **"Run as administrator"** (if needed)
3. If you see a warning, click **"More info"** → **"Run anyway"**
4. The app will run directly without installation

### Why the warning appears:
- Windows SmartScreen flags apps from "unknown publishers"
- This happens to all apps without expensive ($300+/year) code signing certificates
- The app is completely safe - it's just not "recognized" by Microsoft

---

## 🍎 macOS Installation

1. Download `EditMode.dmg`
2. Open the DMG file
3. Drag EditMode to your Applications folder
4. **When you first run it, you'll see a warning**
5. Go to **System Preferences** → **Security & Privacy**
6. Click **"Open Anyway"** next to the EditMode warning

### Alternative method:
1. Right-click the EditMode app
2. Select **"Open"**
3. Click **"Open"** in the dialog that appears

### Why the warning appears:
- macOS Gatekeeper blocks apps from "unidentified developers"
- Apple charges $99/year for developer certificates
- The app is safe - it just hasn't been notarized by Apple

---

## 🐧 Linux Installation

### AppImage (Recommended)
1. Download `EditMode.AppImage`
2. Make it executable: `chmod +x EditMode.AppImage`
3. Run it: `./EditMode.AppImage`

### Debian/Ubuntu (.deb)
1. Download `EditMode.deb`
2. Install: `sudo dpkg -i EditMode.deb`
3. Or double-click to install via Software Center

Linux typically doesn't show security warnings for unsigned applications.

---

## 🛡️ Is EditMode Safe?

**Yes, absolutely!** Here's why you can trust it:

✅ **Open Source**: The complete source code is available on GitHub  
✅ **No Network Access**: EditMode works entirely offline  
✅ **No Data Collection**: We don't collect any personal information  
✅ **Transparent Build**: Built automatically via GitHub Actions  
✅ **Virus Scanned**: All releases are automatically scanned  

The security warnings are purely because we're an independent developer who hasn't purchased expensive certificates from Microsoft/Apple.

---

## 🔒 For Extra Security

If you're still concerned, you can:

1. **Check the file hash** (we provide SHA256 hashes for each release)
2. **Scan with your antivirus** before running
3. **Review the source code** on GitHub
4. **Build from source** yourself using the provided instructions

---

## 💡 Why We Don't Sign

Code signing certificates cost:
- **Windows**: $300-500/year
- **macOS**: $99/year + notarization fees
- **Total**: $400-600/year

We keep EditMode free by avoiding these costs. The app is just as safe without signing!

---

## 🆘 Need Help?

If you have trouble installing, please:
1. Check our [GitHub Issues](https://github.com/VMescape/editmode/issues)
2. Create a new issue with your operating system and error details
3. We'll help you get it working! 