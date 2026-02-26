# FlowCommand — n8n Workflow Automation Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-white?style=for-the-badge" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Vercel-deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

<p align="center">
  <strong>A production-grade automation dashboard to monitor and manage your n8n workflows in real-time.</strong>
</p>

<p align="center">
  <a href="https://workflow-dashboard-five.vercel.app">🚀 Live Demo</a> · 
  <a href="https://github.com/jktrolbot/nackin-workflow-dashboard">📦 Repository</a>
</p>

---

## Overview

FlowCommand is a modern automation dashboard built to showcase workflow management capabilities similar to n8n's UI — with real-time execution monitoring, visual workflow graphs, and a curated template library.

Built as a portfolio project demonstrating expertise in:
- **Automation architecture** — workflow design, node composition, execution pipelines
- **Modern React** — Next.js 15 App Router, Server/Client components, TypeScript
- **Data visualization** — interactive charts with Recharts
- **Production UI** — shadcn/ui, Tailwind v4, mobile responsive

## Features

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
- Execution history: 48+ entries with timestamps, duration, triggered-by, items processed
- Per-workflow metrics: success rate, time saved, total runs

### 📚 Template Library
- 8 pre-built workflow templates:
  - Lead Capture → CRM → Email Sequence
  - Invoice Received → AI Extract → Accounting
  - Support Ticket → AI Classify → Route → Auto-Response
  - Content → Multi-Platform Social Publisher
  - New Signup → Welcome → Onboarding
  - Inventory Alert → Purchase Order → Notification
  - Meeting → AI Notes → CRM Update
  - Churn Risk → Retention Campaign
- Complexity ratings, setup time estimates, time saved per run
- Filter by category, search by name/tag

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, SSG, Server Components |
| **TypeScript** | Full type safety |
| **Tailwind CSS v4** | Styling with `@theme` configuration |
| **shadcn/ui** | Badge, Button, Card, Input, Tooltip, Sheet |
| **Recharts** | Area, Line, Bar charts |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |
| **Syne + DM Sans + JetBrains Mono** | Typography |

## Getting Started

```bash
# Clone
git clone https://github.com/jktrolbot/nackin-workflow-dashboard
cd nackin-workflow-dashboard

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

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

## Design Decisions

**Dark-first aesthetic** — The dashboard uses a deep blue-black palette (`#080b14`) with indigo accents and emerald status indicators. Built for automation engineers who live in dark terminals.

**No backend required** — All data is static mock data that looks real. The execution history generates realistic timestamps, durations, and item counts. Perfect for demos and portfolio showcases.

**Conventional commits** — All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Deployment

Deployed on Vercel with automatic static generation. All pages are pre-rendered at build time.

```bash
vercel --prod
```

---

Built by [Nackin](https://upwork.com) · n8n workflow automation specialist
