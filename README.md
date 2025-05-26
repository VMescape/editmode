# EditMode

A modern desktop document editor for DOCX and XLSX files with multiple themes and export capabilities.

## Features

- 📄 **Document Editing**: Open, edit, and save DOCX files with rich text formatting
- 📊 **Spreadsheet Support**: View and edit XLSX files with full spreadsheet functionality
- 🎨 **Multiple Themes**: Light, Dark, Hacker, and Kawaii themes
- 📤 **Export Options**: Save as DOCX, XLSX, PDF, or HTML
- 🖥️ **Cross-Platform**: Available for Windows, macOS, and Linux
- ⚡ **Fast & Lightweight**: Built with Electron for optimal performance

## Download

### 📥 Latest Release

Download the latest version for your platform:

**[📋 Go to Releases Page](https://github.com/VMescape/editmode/releases/latest)**

### Direct Downloads

- **Windows**: [EditMode-Setup.exe](https://github.com/VMescape/editmode/releases/latest/download/EditMode-Setup-1.0.10.exe)
- **macOS**: [EditMode.dmg](https://github.com/VMescape/editmode/releases/latest/download/EditMode-1.0.10.dmg)
- **Linux**: [EditMode.AppImage](https://github.com/VMescape/editmode/releases/latest/download/EditMode-1.0.10.AppImage)

## Installation

### Windows
1. Download the `.exe` installer
2. Run the installer and follow the setup wizard
3. Launch EditMode from your Start Menu

### macOS
1. Download the `.dmg` file
2. Open the DMG and drag EditMode to your Applications folder
3. Right-click EditMode and select "Open" (first time only for unsigned apps)

### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x EditMode-*.AppImage`
3. Run it: `./EditMode-*.AppImage`

## Usage

1. **Open Files**: Use File → Open to select DOCX or XLSX files
2. **Switch Modes**: Toggle between document and spreadsheet view
3. **Apply Themes**: Choose from Light, Dark, Hacker, or Kawaii themes
4. **Export**: Save your work in multiple formats (DOCX, XLSX, PDF, HTML)
5. **Edit**: Use the toolbar for formatting, colors, and text alignment

## Development

If you want to build from source:

```bash
# Install dependencies
npm install

# Start development
npm start

# Build for distribution
npm run build
```

## Technologies Used

- **Electron** - Desktop application framework
- **HTML/CSS/JavaScript** - Core web technologies
- **Mammoth.js** - DOCX file parsing and conversion
- **XLSX.js** - Excel file handling
- **html-pdf** - PDF generation
- **GitHub Actions** - Automated building and releases 