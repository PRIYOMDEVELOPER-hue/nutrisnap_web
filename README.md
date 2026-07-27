# 🍎 NutriSnap — AI Calorie Tracker

A Cal AI-inspired nutrition tracking web app built with React + Vite + Tailwind CSS + Supabase.

## Features
- 📸 Photo food logging with AI analysis
- 🔍 Barcode scanner
- 🎙️ Voice meal logging
- 🔥 Streaks + achievement badges
- ⚖️ Weight tracking with progress chart
- 📸 Before/After photo comparison
- 🌙 Dark/Light mode toggle
- 💧 Water tracking
- 📊 Progress analytics

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```
Fill in your Supabase and OpenAI keys (see below).

### 3. Run development server
```bash
npm run dev
```
Opens at http://localhost:5173

---

## Supabase Setup (when you create your project)

1. Go to https://supabase.com and create a new project
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy **Project URL** and **anon public key**
4. Put them in your `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
5. In `src/store/useStore.js`, change `isAuthenticated: true` to `false` to enable real auth

## OpenAI Setup (for real AI photo analysis)
1. Get API key from https://platform.openai.com
2. Add to `.env`: `VITE_OPENAI_API_KEY=your-key`
3. Replace the mock analysis in `LogModal.jsx → CameraLogger` with real GPT-4o Vision call

## Project Structure
```
src/
├── components/
│   ├── icons/     Icons.jsx
│   ├── layout/    AppShell.jsx (bottom nav)
│   ├── log/       LogModal, BarcodeScanner, VoiceLogger, FoodSearch
│   └── ui/        CircularProgress, MacroRing, Toggle
├── lib/
│   ├── supabase.js
│   └── mockData.js
├── pages/
│   ├── AuthPage.jsx
│   ├── OnboardingPage.jsx
│   ├── HomePage.jsx
│   ├── ProgressPage.jsx
│   └── ProfilePage.jsx
└── store/
    └── useStore.js  (Zustand)
```
