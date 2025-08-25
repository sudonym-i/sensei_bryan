# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sensei Bryan is an AI educational chatbot built with React and deployed on Netlify. The application emphasizes making users think rather than simply providing answers, featuring multiple learning modes: Teaching Mode (encourages critical thinking), Testing Mode (creates practice tests), and Memory Mode (memorization exercises).

## Development Commands

The main application is located in the `sensei-bryan/` directory. All commands should be run from this subdirectory:

```bash
cd sensei-bryan/
npm start         # Start development server
npm run build     # Build for production
npm test          # Run tests
```

## Architecture

### Frontend Structure
- **React App**: Single-page application with message state management
- **Main Component**: `src/App.js` contains the entire chat interface logic
- **Mode System**: Three learning modes with different AI contexts and behaviors
- **Responsive Design**: Mobile-optimized with viewport height handling

### Backend Integration
- **Netlify Function**: `netlify/functions/messages.ts` handles API communication
- **AI Integration**: Uses OpenRouter API with configurable models
- **Environment Variables**: Requires `auth_ai`, `OPENROUTER_API_URL`, and `model`

### Key Features
- Auto-scrolling chat messages with `messagesEndRef`
- Mobile-responsive tray system for mode selection
- Retry logic for API timeouts (Netlify free tier limitation)
- Markdown rendering for AI responses via `react-markdown`

## Project Structure

```
sensei-bryan/
├── src/App.js           # Main React component with chat logic
├── netlify/functions/   # Serverless functions
│   └── messages.ts      # AI API handler
├── public/              # Static assets
├── netlify.toml         # Netlify deployment configuration
└── package.json         # Dependencies and scripts
```

## Important Implementation Details

- The application sends conversation context to the AI by reading `chat_messages` DOM element
- Mode switching changes the AI's system prompt context
- API requests include retry logic due to Netlify timeout limitations
- Mobile viewport height is handled with CSS custom properties (`--vh`)