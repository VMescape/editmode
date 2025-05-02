# DOCX Viewer

A simple desktop application for viewing and editing DOCX files.

## Features

- Open and view DOCX files
- Clean, modern interface
- Native file dialogs
- Simple saving functionality

## Setup

1. Install dependencies:
```bash
npm install
cd src && npm install
```

2. Build the application:
```bash
npm run build
```

3. Start the desktop app:
```bash
npm start
```

## Building a Standalone App

To create a standalone desktop application:

```bash
npm run package
```

This will create a distributable app in the `dist` folder that you can run directly on your computer.

## Usage

1. Click "Open DOCX" to select a DOCX file
2. View the contents in the main window
3. Click "Save" to save any changes

## Technologies Used

- Electron (Desktop Application Framework)
- React (User Interface)
- Material-UI (UI Components)
- Mammoth.js (DOCX parsing) 