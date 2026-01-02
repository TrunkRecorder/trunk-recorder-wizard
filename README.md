# Trunk Recorder Wizard

A React-based web application for creating and modifying `config.json` files for [Trunk Recorder](https://trunkrecorder.com/).

## Status: ✅ Production Ready

**All Features Complete:**
- ✅ Complete schema system with 100+ field definitions
- ✅ Global settings editor with all configuration options
- ✅ Full source/system/plugin editors with conditional fields
- ✅ List views with add/edit/delete functionality
- ✅ Import wizard with drag-and-drop and validation
- ✅ Real-time JSON preview with syntax highlighting
- ✅ Comprehensive validation with error/warning display
- ✅ File export functionality
- ✅ Advanced mode toggle
- ✅ LocalStorage persistence
- ✅ Dedicated validation panel with clickable error navigation

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173 to view the application.

## Features

### All Processing is Client-Side
No server required - all config editing, validation, and file generation happens in your browser.

### Conditional Field Visibility
Fields automatically show/hide based on other settings:
- SmartNet bandplan options only appear when system type is "smartnet"
- Driver-specific fields only show for the selected SDR driver
- Advanced options can be toggled on/off

### Comprehensive Validation
- Real-time validation using Zod schemas
- 100+ field-level validations
- Custom validation rules (e.g., conventional systems need channels OR channelFile)
- Error and warning severity levels
- Dedicated validation panel showing all issues with clickable navigation to problem areas

### Schema-Driven Configuration
Field definitions are separate from the UI, making it easy to update when Trunk Recorder adds new options.

## Architecture

**State Management:** Zustand with localStorage persistence  
**Validation:** Zod schemas generated from field definitions  
**UI Components:** Radix UI primitives + Tailwind CSS  
**Code Editor:** CodeMirror 6 for JSON preview  

## Documentation

See `PROGRESS.md` for detailed development progress.  
See `DEVELOPMENT_PLAN.md` for the complete implementation plan.

## Project Structure

```
src/
├── config/schema/          # Field definitions for all config options
├── stores/                 # Zustand state management
├── hooks/                  # Validation, import, export hooks
├── components/
│   ├── ui/                # Base UI components
│   ├── fields/            # Form field components
│   ├── editor/            # Editor components
│   └── layout/            # Layout components
└── styles/                # Tailwind CSS
```

## Contributing

This project is under active development. See `PROGRESS.md` for current status and remaining work.
