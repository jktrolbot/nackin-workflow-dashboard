# ⚡ FlowCommand — Workflow Automation Dashboard

> A production-grade automation dashboard to monitor and manage n8n-style workflows in real-time.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://nackin-workflow-dashboard.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

> ⚠️ **Demo Version** — Based on a production system built for a real client. Sensitive data and proprietary business logic have been removed.

---

![App Screenshot](./public/screenshot.png)

---

## ✨ Features

### 📊 Dashboard
- Live execution metrics (runs today, success rate, time saved)
- Error alerts with direct workflow links
- Performance charts: executions over time, success rate, time saved
- Category breakdown by executions

### ⚡ Workflow Management
- Full workflow list with status indicators (active/paused/error)
- Filter by category (Sales, Marketing, Operations, Support)
- Search by name, description, or tags
- Real-time execution counters

### 🔍 Workflow Detail View
- Visual node graph showing the automation flow
- Node types: Trigger → Transform → Condition → Action → Output
- Execution history with timestamps, duration, triggered-by, items processed
- Per-workflow metrics: success rate, time saved, total runs

### 📚 Template Library
- 8 pre-built workflow templates (Lead Capture, Invoice AI, Support Routing, Social Publishing, etc.)
- Complexity ratings, setup time estimates, time saved per run
- Filter by category and search by name/tag

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│               Next.js App Router            │
│                                             │
│  /              → Dashboard (metrics+charts)│
│  /workflows     → Workflow list + filters   │
│  /workflows/[id]→ Detail + node graph       │
│  /templates     → Template library          │
└──────────────────────┬──────────────────────┘
                       │
                  ┌────▼────┐
                  │  lib/   │
                  │ data.ts │  ← Mock data layer
                  └─────────┘  (swap for real API)
```

**Design decisions:**
- **Dark-first** — Deep blue-black palette (`#080b14`) with indigo accents and emerald status indicators
- **No backend required** — Static mock data that looks real. All pages pre-rendered at build time
- **Drop-in API swap** — Replace `lib/data.ts` with real n8n/Make API calls without changing components

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | App Router, SSG, Server Components |
| **TypeScript** | Full type safety |
| **Tailwind CSS v4** | Styling with `@theme` configuration |
| **shadcn/ui** | Badge, Button, Card, Input, Tooltip, Sheet |
| **Recharts** | Area, Line, Bar charts |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |

---

## 🚀 Getting Started

```bash
git clone https://github.com/nackin-io/nackin-workflow-dashboard
cd nackin-workflow-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── workflows/
│   │   ├── page.tsx                # Workflow list with filters
│   │   └── [id]/page.tsx           # Workflow detail + node graph
│   └── templates/page.tsx          # Template showcase
├── components/
│   ├── AppShell.tsx                # Sidebar navigation
│   ├── MetricsCards.tsx            # KPI cards
│   ├── Charts.tsx                  # Recharts components
│   ├── WorkflowCard.tsx            # Workflow list item
│   ├── NodeGraph.tsx               # Visual workflow graph
│   ├── ExecutionHistory.tsx        # Execution log table
│   └── TemplateCard.tsx            # Template showcase card
└── lib/
    └── data.ts                     # Mock data (workflows, templates, metrics)
```

---

## 📄 License

MIT

---

> Built by [**Nackin**](https://nackin.io) — AI Engineering & Full-Stack Development Studio
