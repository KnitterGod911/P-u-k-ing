# PUK

PUK is a modern full-stack web platform that combines games, AI tools, calculator utilities, real-time chat, and user authentication in one polished experience.

## Features

- Modern dark-themed responsive UI
- Sidebar navigation with animated transitions
- Dashboard, Games, AI, Calculator, Group Chat, Profile, and Settings pages
- Rock Paper Scissors, Tic Tac Toe, Number Guessing Game
- High score tracking with browser local storage
- Standard calculator with keyboard support
- AI chat interface backed by OpenAI via backend integration
- Firebase Authentication with Google sign-in and email/password support
- Firebase Firestore real-time group chat
- User profile and settings customization
- Firebase Functions compatible Express backend

## Project Structure

- `frontend/`
  - `index.html` - main app shell and page sections
  - `css/style.css` - aggregator for the design system styles
  - `css/base.css` - typography, spacing, and foundational variables
  - `css/layout.css` - layout and responsive structure
  - `css/components.css` - reusable component styles
  - `css/pages.css` - page-specific styling
  - `css/themes/` - theme variable palettes for Dark, Light, and Neon
  - `js/` - modular frontend logic for auth, games, calculator, AI, chat, theming, and app initialization
- `backend/`
  - `index.js` - Express server and Firebase Functions export
  - `routes/openai.js` - secure OpenAI request proxy
  - `utils/validate.js` - request validation logic
  - `package.json` - backend dependencies and scripts
  - `.env.example` - environment variable template

## Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key to `backend/.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Configure Firebase for frontend usage:
   - Create a Firebase project.
   - Enable Authentication (Email/Password and Google) and Firestore Database.
   - Replace placeholder values in `frontend/js/firebase-config.js` with your real Firebase config.

5. Run the backend server locally:
   ```bash
   cd backend
   npm start
   ```

6. Open your browser to `http://localhost:4242`.

## Notes

- The OpenAI API key is kept on the backend and never exposed to the client.
- Firebase config is required for Authentication and Firestore; these are public configuration values and not secret keys.
- The backend is built to work in Firebase Functions, but can also run as a standalone Express server.

## Future Improvements

- Add persistent user settings in Firestore.
- Expand chat moderation and presence tracking.
- Add more games and AI templates.
- Provide built deployment scripts for Firebase Hosting.
