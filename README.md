# PDF Annotation Tool

A feature-rich PDF annotation tool built with Next.js, allowing users to view, annotate, and sign PDF documents in the browser.

## Features

- **PDF Viewing**: View PDF documents with smooth page navigation using **pdf.js**
- **Annotation Tools**:
  - Highlight text
  - Underline text
  - Freehand drawing
  - Add comments
- **Signature Support**: Capture and embed digital signatures
- **Export Functionality**: Save annotated PDFs with all modifications
- **Responsive UI**: Built with **shadcn/ui** and **Tailwind CSS**
- **User Feedback**: Toast notifications with **Sonner**


## Tech Stack

### Core Libraries
| Library | Purpose |
|---------|---------|
| **Next.js** | React framework for SSR/SSG |
| **pdf.js** | High-performance PDF rendering (Mozilla's PDF viewer) |
| **pdf-lib** | PDF manipulation & annotation embedding |
| **shadcn/ui** | Reusable, accessible UI components |
| **Tailwind CSS** | Utility-first styling |
| **Sonner** | Elegant toast notifications |
| **Lucide React** | SVG icons |
| **react-dropzone** | Drag-and-drop file uploads |

---
### Prerequisites
- Node.js v18+
- pnpm v8+

```bash
# Clone repository
git clone https://github.com/abdulgafar01/frontend-test.git
cd frontend-tes

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm dev
```
## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
### Signature Embedding	Used pdf-lib to convert canvas drawings to PDF vectors with proper coordinate transformation
### Responsive Design	used tailwind css and shandcn ui
### Cross-browser Rendering	Added PDF.js compatibility layer for Safari and legacy browsers

## Future implementation I would add if I had more time

### fix pdf rendering 
### fix pdf worker js using pdf-dist
### Smart Highlighting
### Document Summarization
### Auto-Tagging