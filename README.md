Surprise Calendar (Frontend)
Live Demo: https://richnnl.github.io/SurpriseCalendar/

This is a Vue 3 application built with Vite, serving as the interface for the Surprise Calendar ecosystem.

🚀 Getting Started
Prerequisites
This project uses Bun for package management and execution. Ensure you have Bun installed on your machine.

Environment Configuration
The application requires a connection to Supabase to function correctly.

Note on credentials: You should have received an email containing the Supabase Key. This key must be used for the VITE_SUPABASE_ANON_KEY variable.

Create a file named .env.local in the root directory.

Add the following variables, pasting the key from the email into the second line:
VITE_SUPABASE_ANON_KEY key be supabase key in email

Code snippet
VITE_SUPABASE_URL=https://cmagqrxxdatyxydbkfcj.supabase.co
VITE_SUPABASE_ANON_KEY=pasted_key_from_your_email_
VITE_API_BASE_URL=https://localhost:7201

🛠️ Project Setup
Installation
Bash
bun install
Development
Start the local development server with hot-reload:

Bash
bun dev
Production Build
Type-check, compile, and minify for production:

Bash
bun run build
🧪 Testing & Quality
Unit Testing
This project uses Vitest for unit testing.

Bash
bun test:unit
Linting
To maintain code quality using ESLint:

Bash
bun lint
💻 Recommended Setup
IDE
VS Code + Vue (Official) extension.

Note: Disable the Vetur extension to avoid conflicts.
