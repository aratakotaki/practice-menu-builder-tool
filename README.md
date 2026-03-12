# Practice Menu Builder Tool

A web application for building and managing volleyball practice menus. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

- Create and edit practice menus with a drag-and-drop editor
- Manage a library of drills and exercises
- View analytics on practice sessions
- Save and load menus from Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase project anon/public key |

Set these in `.env.local` for local development, or in your Netlify environment variables for deployment.

## Deployment

This project is configured for deployment on [Netlify](https://netlify.com). The `netlify.toml` file sets the build command to `npm run build` and publishes from the `dist` directory.

## Tech Stack

- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — Build tool
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Backend & database
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [React Router](https://reactrouter.com) — Routing