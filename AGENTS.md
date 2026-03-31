# AGENTS.md

## Project
This repository is for Clopen, a restaurant operations platform built with Next.js, TypeScript, Tailwind, shadcn/ui, and Supabase.

## Product context
Clopen is modular. Modules should be built as independent domains that can later integrate cleanly.

The first domain is Communication & Training Hub.

This product is for restaurant operators and staff. It should feel practical, operational, and fast.

## Technical rules
- Use TypeScript everywhere.
- Use Next.js App Router.
- Prefer server components where appropriate.
- Use Supabase for auth, database, storage, and realtime.
- Use @supabase/ssr for auth-related client setup.
- Use shadcn/ui components where suitable.
- Keep feature code grouped under src/features by domain.
- Keep database changes in explicit Supabase migrations.
- Do not introduce unnecessary abstractions early.
- Do not add Redux.
- Do not add GraphQL.
- Do not add a separate backend framework.

## Database rules
- Include created_at and updated_at timestamps.
- Add created_by when useful.
- Prefer relational tables over JSONB for important entities.
- Preserve operational history.
- Design for multi-location support.

## UI rules
- Mobile-first.
- Minimal and high-signal.
- Avoid overdesigned marketing UI inside the app.
- Optimize for scan speed.

## Workflow rules
- Before making schema changes, explain the migration plan.
- Before adding large new dependencies, explain why.
- Keep PR-sized changes small and modular.
- When unsure, prioritize clarity over cleverness.
