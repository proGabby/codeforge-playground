# CodeForge Playground — Interactive Code Playground & Adaptive Learning Tutor

CodeForge Playground is an AI powered full-stack, interactive code execution playground and intelligent learning platform. Built with **React 19**, **Monaco Editor**, **Express**, and **Google Gemini AI**, CodeForge delivers real-time code evaluation, interactive line-by-line syntax breakdowns, and Socratic graduated hints to help developers master programming concepts.

---

## Features

- **Monaco Code Editor**: Professional-grade code editor powered by VS Code's Monaco engine, with auto-completion, line numbers, and dark mode theme.
- **Graduated 3-Tier Hint System**: Smart error correction cards that provide hints progressively (*Conceptual* → *Syntax* → *Actionable Fix*) without giving away the answer immediately.
- **Socratic AI Mentor**: Integrated with Google Gemini API to serve as a personal coding tutor that answers questions, explains compiler errors, and guides learning.
- **Interactive Line Explanation Engine**: Click any line of code to receive a simple explanation, syntax breakdown, and under-the-hood execution mechanics.
- **Extensible Multi-Language Execution Adapters**: Isolated code execution engine running local compilers safely (currently featuring native **Go 1.22+** support, architected for extension to Python, Rust, TypeScript, and Java).
- **Adaptive Curriculum & Recommendation Engine**: Structured topic tree with interactive test case runner, progress tracking, and intelligent next-exercise recommendations.

---

## Technology Stack

### **Frontend**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Editor**: `@monaco-editor/react`
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

### **Backend**
- **Runtime**: Node.js + Express 5 (TypeScript via `tsx`)
- **AI Engine**: `@google/genai` (Gemini Flash API integration)
- **Language Adapters**: Custom child process execution adapter architecture
- **Concurrency**: `concurrently` dev runner

---

## 📁 Repository Architecture

```
code_playground/
├── src/
│   ├── components/
│   │   ├── Adaptive/        # Recommendation banners & completion modals
│   │   ├── Editor/          # Monaco Code Editor wrapper
│   │   ├── Navbar.tsx       # Top navigation header & language selector
│   │   ├── Sidebar/         # Curriculum tree & topic navigation
│   │   ├── Terminal/        # Test case runner & execution output panel
│   │   └── Tutor/           # Guided correction cards & line explanation panel
│   ├── context/
│   │   └── AppContext.tsx   # Global state management (exercise, execution, hints)
│   ├── types.ts             # Core TypeScript interfaces & contracts
│   └── App.tsx              # Main layout dashboard
├── server/
│   ├── adapters/            # Language adapter interface & Go adapter
│   ├── data/                # Curriculum definitions & test cases
│   ├── engine/              # CorrectionEngine, AdaptiveEngine & GeminiMentorEngine
│   └── index.ts             # Express REST API routes
├── .env.example             # Template environment configuration
└── package.json
```

---

## Quick Start & Installation

### **Prerequisites**
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Go (Golang)**: `v1.22+` installed locally (for running Go exercises)

### **1. Clone the Repository**
```bash
git clone https://github.com/proGabby/codeforge-playground.git
cd code-playground
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Copy `.env.example` to `.env` and insert your Gemini API Key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

> *You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

### **4. Start the Application**
Run both the Express backend server and Vite frontend concurrently with a single command:

```bash
npm start
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm start` | Launches both Express backend and Vite frontend concurrently |
| `npm run dev` | Starts only the Vite frontend development server |
| `npm run server` | Starts only the Express backend server (with live reloading) |
| `npm run build` | Runs TypeScript compiler checks and builds production Vite bundle |
| `npm run preview` | Previews the production build locally |

---

## API Endpoints

The backend server exposes the following REST endpoints:

- `GET /api/languages` — List supported programming languages and runtime versions.
- `GET /api/curriculum` — Retrieve topic trees and available exercises.
- `POST /api/run` — Run standalone code snippet and return stdout/stderr/execution time.
- `POST /api/submit` — Submit user solution against hidden & public test cases.
- `POST /api/explain-line` — Generate line-by-line syntax breakdown for user code.
- `POST /api/adaptive-recommendations` — Fetch personalized exercise suggestions based on user progress.
- `POST /api/ai-mentor` — Query the Socratic Gemini AI mentor for guided assistance.

---

