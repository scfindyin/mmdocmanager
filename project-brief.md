# Document Manager Application

## Requirements

I need a desktop application that will work with files on a local workstation:

1. **Document Management**
   - Import various document types (Word, Excel, PDF) from the local workstation
   - Copy imported files to a project-specific folder
   - Display documents visually with ability to drag/reorder them
   - Open documents in native applications when clicked

2. **Separator & Notes System**
   - Add separators between documents
   - Allow adding notes or existing documents at separator positions
   - Notes should be linked to documents (move with them during reordering)
   - Notes should be editable when clicked

3. **PDF Generation**
   - Combine all documents into a single PDF
   - Generate a clickable table of contents
   - Include all documents in the order displayed
   - Notes become pages in the final PDF

4. **User Interface**
   - Modern UI with shadcn/tailwind-inspired styling
   - Drag-and-drop functionality
   - Visual feedback for user actions
   - Project-based organization

## Technical Requirements

- Electron application for cross-platform desktop support
- React for the UI components
- Local file system operations
- PDF manipulation capabilities