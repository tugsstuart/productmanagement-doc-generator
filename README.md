# 🤖 Product Documentation Generator

[![GitHub stars](https://img.shields.io/github/stars/shrinandan1686/productmanagement-doc-generator?style=social)](https://github.com/shrinandan1686/productmanagement-doc-generator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shrinandan1686/productmanagement-doc-generator?style=social)](https://github.com/shrinandan1686/productmanagement-doc-generator/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A full-stack web application that uses AI to generate professional product documentation including PRDs, FRDs, User Stories, Acceptance Criteria, UAT documents, and Meeting Minutes.

## Features

- **Multiple Document Types**: PRD, FRD, UAT, User Stories, Acceptance Criteria, Meeting Minutes
- **3 AI Providers**: OpenAI GPT, Anthropic Claude, and Google Gemini
- **Smart Provider Switching**: Real-time switching between AI providers
- **Editable Templates**: Customize prompt templates for each document type
- **Live Preview**: Real-time markdown preview with editing capabilities
- **Multiple Export Formats**: PDF, DOCX, and Markdown downloads
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

**Frontend:**
- Next.js 14
- React 18
- React Markdown
- Lucide React (icons)
- CSS3

**Backend:**
- Node.js
- Express.js
- OpenAI API / Anthropic Claude API / Google Gemini API
- PDFKit (PDF generation)
- docx (Word document generation)

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- At least one AI API key:
  - **OpenAI**: https://platform.openai.com/api-keys (Requires billing)
  - **Anthropic**: https://console.anthropic.com/ (Requires billing)  
  - **Gemini**: https://makersuite.google.com/app/apikey (**FREE** tier available!)

### Installation

1. **Clone and install dependencies:**
```bash
cd product-doc-generator
npm run install:all
```

2. **Set up environment variables:**

**Server (.env):**
```bash
cd server
cp .env.example .env
# Edit .env with your API keys
```

**Client (.env.local):**
```bash
cd client
cp .env.local.example .env.local
```

3. **Start development servers:**
```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:3001
- Frontend application on http://localhost:3000

## Environment Variables

### Server (`server/.env`)
```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GEMINI_API_KEY=your-gemini-key-here
LLM_PROVIDER=gemini  # or 'openai' or 'anthropic'
```

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usage

1. **Select Document Type**: Choose from PRD, FRD, UAT, User Stories, Acceptance Criteria, or Meeting Minutes
2. **Review/Edit Prompt**: The default template loads automatically, but you can customize it
3. **Add Context**: Provide specific details about your project or requirements
4. **Generate**: Click "Generate Document" to create your documentation
5. **Preview/Edit**: Review the generated content and make edits if needed
6. **Export**: Download as PDF, DOCX, or Markdown

## Customization

### Adding New Document Types

1. **Add template to `server/data/templates.json`:**
```json
{
  "NewType": {
    "name": "New Document Type",
    "prompt": "Generate a document for: {{context}}"
  }
}
```

2. **The new type will automatically appear in the dropdown**

## License

MIT License - feel free to use this project for commercial or personal use.

