# Clopen MVP Blueprint

## 1. Final Stack and Architecture
- Monorepo with `pnpm` workspaces:
  - `apps/web`: Next.js 15 App Router, TypeScript, Supabase SSR auth
  - `apps/mobile`: Expo + expo-router for staff-first mobile flows
  - `packages/types`: shared database and domain TypeScript types
  - `packages/ui`: shared design tokens
- Backend and persistence:
  - Supabase Postgres, Auth, Storage
  - Strict RLS on all tenant/user data tables
- Multi-tenant hierarchy:
  - `group -> restaurant -> location`
  - Operational data scoped to `location_id` with `group_id` denormalized
- White-labeling:
  - `brand_settings` supports `group`, `restaurant`, `location` scope
  - resolution order: location override, then restaurant override, then group default

## 2. Database Schema (Detailed)
Implemented in:
- `supabase/migrations/20260309104500_mvp_schema.sql`
- `packages/types/src/database.ts`

Entity domains:
- Tenant and identity: `profiles`, `groups`, `restaurants`, `locations`, `group_memberships`, `memberships`, `invites`
- Branding: `brand_settings`, `effective_brand_settings` view
- Menu knowledge: `menu_categories`, `menu_items`, `allergens`, `menu_item_allergens`, `beverage_categories`, `beverage_items`, `pairings`
- Training: `training_programs`, `training_modules`, `lessons`, `activities`, `quizzes`, `quiz_questions`, `quiz_options`, `activity_attempts`, `trainer_signoffs`
- Certification: `certifications`, `certification_requirements`, `user_certifications`
- Communication: `boards`, `posts`, `post_acknowledgements`
- Progress and notification: `user_lesson_progress`, `user_module_progress`, `notifications`, `notification_preferences`
- Audit: `audit_events`

## 3. Roles and Permissions
Roles:
- `platform_admin`
- `group_admin`
- `location_manager`
- `trainer`
- `staff`

Permission matrix is defined in:
- `packages/types/src/domain.ts` (`ROLE_PERMISSIONS`)

Highlights:
- Group/location management: platform/group admins
- Content authoring (menu, beverage, training, lineup/boards): location managers and trainers
- Staff: consume assigned content, submit progress, acknowledge posts

## 4. Supabase RLS Strategy
Implemented with:
- helper functions: `is_platform_admin`, `user_is_group_admin`, `user_has_group_access`, `user_has_location_access`, `user_has_location_role`
- table-level RLS enabled for all public tables
- policy patterns:
  - read: membership-based access to group/location scoped records
  - write: role-gated (`location_manager` + `trainer` for content; manager/admin for membership/branding)
  - user-private tables (`notifications`, progress, attempts): self-access plus manager/trainer oversight where relevant

## 5. Web Routes and Mobile Screens
Web routes (`apps/web/app`):
- Auth: `/login`
- Admin shell:
  - `/admin`
  - `/admin/locations`
  - `/admin/users`
  - `/admin/branding`
  - `/admin/training`
  - `/admin/communications`
- Staff shell:
  - `/staff`
  - `/staff/training`
  - `/staff/menu`
  - `/staff/lineup`

Mobile screens (`apps/mobile/app`):
- `/(auth)/sign-in`
- `/(staff)/index`
- `/(staff)/training`
- `/(staff)/menu`
- `/(staff)/lineup`

## 6. Admin Workflows
- Configure tenant:
  - create group -> restaurant -> location
- Configure branding:
  - update brand tokens and logo by tenant scope
- Manage people:
  - invite users, assign role, activate/suspend membership
- Manage training and knowledge:
  - create programs/modules/lessons/activities/quizzes
  - create menu/beverage cards and pairings
- Operate communication:
  - publish lineup/board posts
  - track acknowledgement and completion

## 7. Staff Workflows
- Sign in and auto-resolve active location membership
- Review daily pre-shift lineup and acknowledge
- Complete assigned lessons/quizzes/signoff tasks
- Study menu and beverage cards with pairing/allergen details
- Track personal progress and certification status

## 8. API/Data Model Relationships
- `group` has many `restaurants` and `locations`
- `location` owns most operational tables for strict data partitioning
- `memberships` bridge users to location roles
- `training_programs -> training_modules -> lessons -> activities`
- `activities -> quizzes -> quiz_questions -> quiz_options`
- `certifications -> certification_requirements`, `user_certifications`
- `boards -> posts -> post_acknowledgements`
- `menu_items <-> allergens` via `menu_item_allergens`
- `menu_items <-> beverage_items` via `pairings`

## 9. Phased Implementation Plan
- Phase 0: foundation
  - schema + auth + RLS + branded web shells
- Phase 1: admin core
  - tenant/location setup, invites, roles, branding UI
- Phase 2: training/menu authoring
  - content CRUD + quiz/signoff + progress
- Phase 3: communications and notifications
  - lineup boards, acknowledgements, in-app notifications
- Phase 4: mobile staff rollout
  - auth + training/lineup/menu read/complete flows
- Phase 5: hardening and launch
  - telemetry, tests, performance, pilot tenant QA

## 17. Defer to V2
- SSO/SAML and SCIM provisioning
- Full workflow automation and recurring reminders
- Rich analytics and cohort reporting
- Offline mode in mobile app
- Version history and approval workflows for content
- BOH-specific workflows and station-level competency maps
- Multi-language localization
- Push notifications (APNs/FCM)
