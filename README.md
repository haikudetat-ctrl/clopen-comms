# Clopen Hospitality Platform MVP

Production-oriented scaffold for a multi-tenant, white-label hospitality training platform.

## Implemented in this scaffold
- Next.js app foundation with admin and staff shells
- Expo app foundation for staff mobile experience
- Supabase schema with multi-tenant model and RLS
- Role-permission model and shared TypeScript data types
- Demo seed data for a sample fine-dining restaurant

## Workspace Layout
- `apps/web`: Next.js web app
- `apps/mobile`: Expo mobile app
- `packages/types`: shared domain/database types
- `packages/ui`: shared theme tokens
- `supabase/migrations`: SQL schema and policies
- `supabase/seed.sql`: demo data
- `docs/mvp-blueprint.md`: architecture, workflows, phased plan

## Environment
Create `.env` files from examples:
- root `.env.example`
- `apps/web/.env.example`
- `apps/mobile/.env.example`

Current Supabase URL is prefilled:
- `https://dzeuamikcqdutzcnmsno.supabase.co`

## Run web app
```bash
pnpm install
pnpm dev:web
```

## Run mobile app
```bash
pnpm install
pnpm dev:mobile
```

## Apply database schema
Run migration SQL in Supabase SQL editor or via CLI:
- `supabase/migrations/20260309104500_mvp_schema.sql`

Then seed demo content:
- `supabase/seed.sql`

## Notes
- RLS is strict by default; service-role usage is required for admin scripts.
- Before running `supabase/seed.sql`, create these Auth users in Supabase Dashboard:
  - `admin@ateliergroup.com` / `Password123!`
  - `staff@ateliermidtown.com` / `Password123!`
