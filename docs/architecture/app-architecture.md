# App Architecture

## Baseline Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

## Structure
- `src/app`: routes, layouts, and server components
- `src/components`: shared UI
- `src/features`: domain modules
- `src/lib`: infrastructure helpers (supabase/auth/utils)

## Module Boundary
Each module should own its:
- UI components
- data queries
- server actions
- types

