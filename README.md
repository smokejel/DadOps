# DadOps Dashboard

A "Mission Control" dashboard for expectant fathers to track finances, tasks, and preparation milestones leading up to their baby's arrival.

## Features

- **Dashboard** - Mission Control view with countdown timer, key financial stats, and Mission Intelligence timeline showing trimester milestones
- **Roadmap** - Task management organized by trimester and category (Medical, Finance, Gear, etc.) with high-stakes deadline warnings
- **War Chest** - Budget tracking across categories (Gear, Nursery, Childcare) with progress visualization
- **Compare Plans** - Side-by-side insurance plan comparison with automatic cost calculations and recommendation
- **Settings** - Manage due date, insurance details, and cash on hand

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (dark mode)
- **Icons:** Material Symbols Outlined
- **Font:** Inter
- **State:** localStorage (client-side persistence)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── roadmap/          # Task roadmap
│   │   ├── war-chest/        # Budget tracking
│   │   ├── compare/          # Insurance comparison
│   │   └── settings/         # User settings
│   └── onboarding/           # Initial setup flow
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── compare/              # Comparison feature components
│   └── ui/                   # Shared UI components
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── calculations.ts       # Insurance cost calculations
│   ├── dashboardUtils.ts     # Dashboard utilities
│   ├── compareUtils.ts       # Plan comparison logic
│   └── constants.ts          # Shared constants
└── hooks/                    # Custom React hooks
```

## Design System

- **Primary Color:** Emerald (`emerald-500`)
- **Background:** Gray 900 (`gray-900`)
- **Cards:** Gray 800 (`gray-800`)
- **Category Colors:**
  - Medical: Blue
  - Finance: Green
  - Gear: Purple
  - Home/Nursery: Teal
  - Childcare: Orange
  - Admin: Gray
  - Preparation: Pink

## Documentation

See `docs/Implementation_plan_v2.md` for detailed implementation specifications and `CLAUDE.md` for development guidance.
