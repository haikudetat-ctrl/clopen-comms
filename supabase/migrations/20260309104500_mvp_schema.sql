-- Multi-tenant white-label hospitality training MVP schema
create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.app_role as enum (
  'platform_admin',
  'group_admin',
  'location_manager',
  'trainer',
  'staff'
);

create type public.membership_status as enum ('invited', 'active', 'suspended');
create type public.brand_scope as enum ('group', 'restaurant', 'location');
create type public.activity_type as enum ('flashcard', 'quiz', 'video', 'reading', 'trainer_signoff', 'scenario');
create type public.certification_status as enum ('in_progress', 'earned', 'expired');
create type public.board_type as enum ('lineup', 'menu_updates', 'beverage_updates', 'operations', 'training_updates');
create type public.post_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email citext not null,
  full_name text,
  phone text,
  avatar_url text,
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (group_id, slug)
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  slug text not null,
  timezone text not null default 'America/New_York',
  city text,
  state_region text,
  country_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (restaurant_id, slug)
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location_id, user_id)
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  invited_by uuid not null references auth.users (id),
  email citext not null,
  role public.app_role not null,
  invite_token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  scope public.brand_scope not null,
  group_id uuid references public.groups (id) on delete cascade,
  restaurant_id uuid references public.restaurants (id) on delete cascade,
  location_id uuid references public.locations (id) on delete cascade,
  brand_name text not null,
  logo_url text,
  primary_color text not null default '#173A2A',
  accent_color text not null default '#A67C2B',
  surface_color text not null default '#FFFCF7',
  typeface_heading text not null default 'Cormorant Garamond',
  typeface_body text not null default 'Manrope',
  nav_label_overrides jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brand_scope_reference_check check (
    (scope = 'group' and group_id is not null and restaurant_id is null and location_id is null)
    or (scope = 'restaurant' and group_id is null and restaurant_id is not null and location_id is null)
    or (scope = 'location' and group_id is null and restaurant_id is null and location_id is not null)
  ),
  unique (group_id),
  unique (restaurant_id),
  unique (location_id)
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  category_id uuid references public.menu_categories (id) on delete set null,
  name text not null,
  menu_description text not null,
  chef_notes text,
  tableside_description text,
  pos_reference text,
  seasonal_tag text,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.allergens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table public.menu_item_allergens (
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  allergen_id uuid not null references public.allergens (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (menu_item_id, allergen_id)
);

create table public.beverage_categories (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.beverage_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  category_id uuid references public.beverage_categories (id) on delete set null,
  name text not null,
  item_type text not null,
  description text,
  producer text,
  region text,
  vintage text,
  abv numeric(5,2),
  serving_notes text,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.pairings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  beverage_item_id uuid not null references public.beverage_items (id) on delete cascade,
  notes text,
  strength int not null default 3,
  created_at timestamptz not null default now(),
  constraint pairing_strength check (strength between 1 and 5)
);

create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  name text not null,
  description text,
  is_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.training_modules (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  program_id uuid not null references public.training_programs (id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  estimated_minutes int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  module_id uuid not null references public.training_modules (id) on delete cascade,
  title text not null,
  content_markdown text,
  video_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  activity_type public.activity_type not null,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  min_pass_score int,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint min_pass_score_valid check (min_pass_score is null or (min_pass_score between 0 and 100))
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  activity_id uuid not null unique references public.activities (id) on delete cascade,
  title text not null,
  randomize_questions boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null,
  explanation text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  score int,
  passed boolean,
  attempt_no int not null default 1,
  submitted_at timestamptz not null default now(),
  constraint score_valid check (score is null or (score between 0 and 100))
);

create table public.trainer_signoffs (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  staff_user_id uuid not null references auth.users (id) on delete cascade,
  trainer_user_id uuid references auth.users (id),
  status text not null default 'pending',
  notes text,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trainer_signoff_status check (status in ('pending', 'approved', 'rejected'))
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.certification_requirements (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid not null references public.certifications (id) on delete cascade,
  requirement_type text not null,
  reference_id uuid,
  min_score int,
  created_at timestamptz not null default now(),
  constraint requirement_type_check check (requirement_type in ('module', 'activity', 'minimum_score')),
  constraint requirement_score_valid check (min_score is null or (min_score between 0 and 100))
);

create table public.user_certifications (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid not null references public.certifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.certification_status not null default 'in_progress',
  awarded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (certification_id, user_id)
);

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  board_type public.board_type not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (location_id, board_type)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  board_id uuid not null references public.boards (id) on delete cascade,
  author_user_id uuid not null references auth.users (id),
  title text not null,
  body_markdown text not null,
  status public.post_status not null default 'draft',
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.post_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz,
  progress_percent int not null default 0,
  updated_at timestamptz not null default now(),
  constraint lesson_progress_valid check (progress_percent between 0 and 100),
  unique (lesson_id, user_id)
);

create table public.user_module_progress (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  module_id uuid not null references public.training_modules (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completion_percent int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint module_progress_valid check (completion_percent between 0 and 100),
  unique (module_id, user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  lineup_enabled boolean not null default true,
  training_enabled boolean not null default true,
  communications_enabled boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time,
  updated_at timestamptz not null default now(),
  unique (location_id, user_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups (id) on delete set null,
  location_id uuid references public.locations (id) on delete set null,
  actor_user_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  entity_table text not null,
  entity_id uuid not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index memberships_user_idx on public.memberships (user_id, status);
create index memberships_location_idx on public.memberships (location_id, status);
create index group_memberships_user_idx on public.group_memberships (user_id, status);
create index locations_group_idx on public.locations (group_id);
create index posts_location_created_idx on public.posts (location_id, created_at desc);
create index notifications_user_idx on public.notifications (user_id, read_at);
create index activity_attempts_user_idx on public.activity_attempts (user_id, submitted_at desc);
create index lesson_progress_user_idx on public.user_lesson_progress (user_id);
create index module_progress_user_idx on public.user_module_progress (user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger trg_groups_touch before update on public.groups for each row execute function public.touch_updated_at();
create trigger trg_restaurants_touch before update on public.restaurants for each row execute function public.touch_updated_at();
create trigger trg_locations_touch before update on public.locations for each row execute function public.touch_updated_at();
create trigger trg_group_memberships_touch before update on public.group_memberships for each row execute function public.touch_updated_at();
create trigger trg_memberships_touch before update on public.memberships for each row execute function public.touch_updated_at();
create trigger trg_brand_settings_touch before update on public.brand_settings for each row execute function public.touch_updated_at();
create trigger trg_menu_categories_touch before update on public.menu_categories for each row execute function public.touch_updated_at();
create trigger trg_menu_items_touch before update on public.menu_items for each row execute function public.touch_updated_at();
create trigger trg_beverage_categories_touch before update on public.beverage_categories for each row execute function public.touch_updated_at();
create trigger trg_beverage_items_touch before update on public.beverage_items for each row execute function public.touch_updated_at();
create trigger trg_training_programs_touch before update on public.training_programs for each row execute function public.touch_updated_at();
create trigger trg_training_modules_touch before update on public.training_modules for each row execute function public.touch_updated_at();
create trigger trg_lessons_touch before update on public.lessons for each row execute function public.touch_updated_at();
create trigger trg_activities_touch before update on public.activities for each row execute function public.touch_updated_at();
create trigger trg_quizzes_touch before update on public.quizzes for each row execute function public.touch_updated_at();
create trigger trg_quiz_questions_touch before update on public.quiz_questions for each row execute function public.touch_updated_at();
create trigger trg_trainer_signoffs_touch before update on public.trainer_signoffs for each row execute function public.touch_updated_at();
create trigger trg_certifications_touch before update on public.certifications for each row execute function public.touch_updated_at();
create trigger trg_user_certifications_touch before update on public.user_certifications for each row execute function public.touch_updated_at();
create trigger trg_boards_touch before update on public.boards for each row execute function public.touch_updated_at();
create trigger trg_posts_touch before update on public.posts for each row execute function public.touch_updated_at();
create trigger trg_notification_preferences_touch before update on public.notification_preferences for each row execute function public.touch_updated_at();

create or replace function public.ensure_group_matches_location()
returns trigger
language plpgsql
as $$
declare
  expected_group uuid;
begin
  select l.group_id into expected_group
  from public.locations l
  where l.id = new.location_id;

  if expected_group is null then
    raise exception 'Invalid location_id %', new.location_id;
  end if;

  if new.group_id <> expected_group then
    raise exception 'group_id % does not match location group_id %', new.group_id, expected_group;
  end if;

  return new;
end;
$$;

create trigger trg_memberships_group_match
before insert or update on public.memberships
for each row execute function public.ensure_group_matches_location();

create trigger trg_invites_group_match
before insert or update on public.invites
for each row execute function public.ensure_group_matches_location();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.is_platform_admin = true
  );
$$;

create or replace function public.user_is_group_admin(target_group uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_memberships gm
    where gm.user_id = auth.uid()
      and gm.group_id = target_group
      and gm.status = 'active'
      and gm.role = 'group_admin'
  );
$$;

create or replace function public.user_has_group_access(target_group uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.group_memberships gm
      where gm.user_id = auth.uid()
        and gm.group_id = target_group
        and gm.status = 'active'
    )
    or exists (
      select 1
      from public.memberships m
      where m.user_id = auth.uid()
        and m.group_id = target_group
        and m.status = 'active'
    );
$$;

create or replace function public.user_has_location_access(target_location uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.memberships m
      where m.user_id = auth.uid()
        and m.location_id = target_location
        and m.status = 'active'
    )
    or exists (
      select 1
      from public.locations l
      join public.group_memberships gm on gm.group_id = l.group_id
      where l.id = target_location
        and gm.user_id = auth.uid()
        and gm.status = 'active'
    );
$$;

create or replace function public.user_has_location_role(target_location uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.memberships m
      where m.user_id = auth.uid()
        and m.location_id = target_location
        and m.status = 'active'
        and m.role = any (allowed_roles)
    )
    or exists (
      select 1
      from public.locations l
      join public.group_memberships gm on gm.group_id = l.group_id
      where l.id = target_location
        and gm.user_id = auth.uid()
        and gm.status = 'active'
        and gm.role = 'group_admin'
    );
$$;

create or replace view public.effective_brand_settings as
select
  g.id as group_id,
  coalesce(bs.brand_name, g.name) as brand_name,
  bs.logo_url,
  coalesce(bs.primary_color, '#173A2A') as primary_color,
  coalesce(bs.accent_color, '#A67C2B') as accent_color,
  coalesce(bs.surface_color, '#FFFCF7') as surface_color,
  coalesce(bs.typeface_heading, 'Cormorant Garamond') as typeface_heading,
  coalesce(bs.typeface_body, 'Manrope') as typeface_body
from public.groups g
left join public.brand_settings bs on bs.group_id = g.id and bs.scope = 'group';

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.restaurants enable row level security;
alter table public.locations enable row level security;
alter table public.group_memberships enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.brand_settings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.allergens enable row level security;
alter table public.menu_item_allergens enable row level security;
alter table public.beverage_categories enable row level security;
alter table public.beverage_items enable row level security;
alter table public.pairings enable row level security;
alter table public.training_programs enable row level security;
alter table public.training_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.activities enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.activity_attempts enable row level security;
alter table public.trainer_signoffs enable row level security;
alter table public.certifications enable row level security;
alter table public.certification_requirements enable row level security;
alter table public.user_certifications enable row level security;
alter table public.boards enable row level security;
alter table public.posts enable row level security;
alter table public.post_acknowledgements enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_module_progress enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select on public.profiles
for select
using (user_id = auth.uid() or public.is_platform_admin());

create policy profiles_update on public.profiles
for update
using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

create policy groups_select on public.groups
for select
using (public.user_has_group_access(id));

create policy groups_manage on public.groups
for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy restaurants_select on public.restaurants
for select
using (public.user_has_group_access(group_id));

create policy restaurants_manage on public.restaurants
for all
using (public.user_is_group_admin(group_id) or public.is_platform_admin())
with check (public.user_is_group_admin(group_id) or public.is_platform_admin());

create policy locations_select on public.locations
for select
using (public.user_has_group_access(group_id));

create policy locations_manage on public.locations
for all
using (public.user_is_group_admin(group_id) or public.is_platform_admin())
with check (public.user_is_group_admin(group_id) or public.is_platform_admin());

create policy group_memberships_select on public.group_memberships
for select
using (user_id = auth.uid() or public.user_is_group_admin(group_id) or public.is_platform_admin());

create policy group_memberships_manage on public.group_memberships
for all
using (public.user_is_group_admin(group_id) or public.is_platform_admin())
with check (public.user_is_group_admin(group_id) or public.is_platform_admin());

create policy memberships_select on public.memberships
for select
using (user_id = auth.uid() or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]) or public.is_platform_admin());

create policy memberships_manage on public.memberships
for all
using (public.user_has_location_role(location_id, array['location_manager']::public.app_role[]) or public.is_platform_admin())
with check (public.user_has_location_role(location_id, array['location_manager']::public.app_role[]) or public.is_platform_admin());

create policy invites_select on public.invites
for select
using (public.user_has_location_role(location_id, array['location_manager']::public.app_role[]) or email = (select p.email from public.profiles p where p.user_id = auth.uid()));

create policy invites_manage on public.invites
for all
using (public.user_has_location_role(location_id, array['location_manager']::public.app_role[]) or public.is_platform_admin())
with check (public.user_has_location_role(location_id, array['location_manager']::public.app_role[]) or public.is_platform_admin());

create policy brand_settings_select on public.brand_settings
for select
using (
  (group_id is not null and public.user_has_group_access(group_id))
  or (restaurant_id is not null and exists (select 1 from public.restaurants r where r.id = restaurant_id and public.user_has_group_access(r.group_id)))
  or (location_id is not null and public.user_has_location_access(location_id))
);

create policy brand_settings_manage on public.brand_settings
for all
using (
  public.is_platform_admin()
  or (group_id is not null and public.user_is_group_admin(group_id))
  or (
    restaurant_id is not null
    and exists (
      select 1 from public.restaurants r
      where r.id = restaurant_id and public.user_is_group_admin(r.group_id)
    )
  )
  or (location_id is not null and public.user_has_location_role(location_id, array['location_manager']::public.app_role[]))
)
with check (
  public.is_platform_admin()
  or (group_id is not null and public.user_is_group_admin(group_id))
  or (
    restaurant_id is not null
    and exists (
      select 1 from public.restaurants r
      where r.id = restaurant_id and public.user_is_group_admin(r.group_id)
    )
  )
  or (location_id is not null and public.user_has_location_role(location_id, array['location_manager']::public.app_role[]))
);

create policy menu_categories_select on public.menu_categories
for select
using (public.user_has_location_access(location_id));

create policy menu_categories_manage on public.menu_categories
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy menu_items_select on public.menu_items
for select
using (public.user_has_location_access(location_id));

create policy menu_items_manage on public.menu_items
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy allergens_select on public.allergens
for select
using (true);

create policy allergens_manage on public.allergens
for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy menu_item_allergens_select on public.menu_item_allergens
for select
using (exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.user_has_location_access(mi.location_id)));

create policy menu_item_allergens_manage on public.menu_item_allergens
for all
using (exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.user_has_location_role(mi.location_id, array['location_manager','trainer']::public.app_role[])))
with check (exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.user_has_location_role(mi.location_id, array['location_manager','trainer']::public.app_role[])));

create policy beverage_categories_select on public.beverage_categories
for select
using (public.user_has_location_access(location_id));

create policy beverage_categories_manage on public.beverage_categories
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy beverage_items_select on public.beverage_items
for select
using (public.user_has_location_access(location_id));

create policy beverage_items_manage on public.beverage_items
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy pairings_select on public.pairings
for select
using (public.user_has_location_access(location_id));

create policy pairings_manage on public.pairings
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy training_programs_select on public.training_programs
for select
using (public.user_has_location_access(location_id));

create policy training_programs_manage on public.training_programs
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy training_modules_select on public.training_modules
for select
using (public.user_has_location_access(location_id));

create policy training_modules_manage on public.training_modules
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy lessons_select on public.lessons
for select
using (public.user_has_location_access(location_id));

create policy lessons_manage on public.lessons
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy activities_select on public.activities
for select
using (public.user_has_location_access(location_id));

create policy activities_manage on public.activities
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy quizzes_select on public.quizzes
for select
using (public.user_has_location_access(location_id));

create policy quizzes_manage on public.quizzes
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy quiz_questions_select on public.quiz_questions
for select
using (public.user_has_location_access(location_id));

create policy quiz_questions_manage on public.quiz_questions
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy quiz_options_select on public.quiz_options
for select
using (
  exists (
    select 1
    from public.quiz_questions qq
    where qq.id = question_id
      and public.user_has_location_access(qq.location_id)
  )
);

create policy quiz_options_manage on public.quiz_options
for all
using (
  exists (
    select 1
    from public.quiz_questions qq
    where qq.id = question_id
      and public.user_has_location_role(qq.location_id, array['location_manager','trainer']::public.app_role[])
  )
)
with check (
  exists (
    select 1
    from public.quiz_questions qq
    where qq.id = question_id
      and public.user_has_location_role(qq.location_id, array['location_manager','trainer']::public.app_role[])
  )
);

create policy activity_attempts_select on public.activity_attempts
for select
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy activity_attempts_insert on public.activity_attempts
for insert
with check (
  user_id = auth.uid()
  and public.user_has_location_access(location_id)
);

create policy trainer_signoffs_select on public.trainer_signoffs
for select
using (
  staff_user_id = auth.uid()
  or trainer_user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy trainer_signoffs_manage on public.trainer_signoffs
for all
using (
  staff_user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
)
with check (
  staff_user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy certifications_select on public.certifications
for select
using (public.user_has_location_access(location_id));

create policy certifications_manage on public.certifications
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy certification_requirements_select on public.certification_requirements
for select
using (
  exists (
    select 1 from public.certifications c
    where c.id = certification_id and public.user_has_location_access(c.location_id)
  )
);

create policy certification_requirements_manage on public.certification_requirements
for all
using (
  exists (
    select 1 from public.certifications c
    where c.id = certification_id
      and public.user_has_location_role(c.location_id, array['location_manager','trainer']::public.app_role[])
  )
)
with check (
  exists (
    select 1 from public.certifications c
    where c.id = certification_id
      and public.user_has_location_role(c.location_id, array['location_manager','trainer']::public.app_role[])
  )
);

create policy user_certifications_select on public.user_certifications
for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.certifications c
    where c.id = certification_id
      and public.user_has_location_role(c.location_id, array['location_manager','trainer']::public.app_role[])
  )
);

create policy user_certifications_manage on public.user_certifications
for all
using (
  exists (
    select 1 from public.certifications c
    where c.id = certification_id
      and public.user_has_location_role(c.location_id, array['location_manager','trainer']::public.app_role[])
  )
)
with check (
  exists (
    select 1 from public.certifications c
    where c.id = certification_id
      and public.user_has_location_role(c.location_id, array['location_manager','trainer']::public.app_role[])
  )
);

create policy boards_select on public.boards
for select
using (public.user_has_location_access(location_id));

create policy boards_manage on public.boards
for all
using (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
with check (public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]));

create policy posts_select on public.posts
for select
using (
  public.user_has_location_access(location_id)
  and (status = 'published' or author_user_id = auth.uid() or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[]))
);

create policy posts_manage on public.posts
for all
using (
  public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
)
with check (
  public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy post_acknowledgements_select on public.post_acknowledgements
for select
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.posts p
    where p.id = post_id
      and public.user_has_location_role(p.location_id, array['location_manager','trainer']::public.app_role[])
  )
);

create policy post_acknowledgements_insert on public.post_acknowledgements
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.posts p where p.id = post_id and public.user_has_location_access(p.location_id)
  )
);

create policy user_lesson_progress_select on public.user_lesson_progress
for select
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy user_lesson_progress_upsert on public.user_lesson_progress
for all
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
)
with check (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy user_module_progress_select on public.user_module_progress
for select
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy user_module_progress_upsert on public.user_module_progress
for all
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
)
with check (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy notifications_select on public.notifications
for select
using (user_id = auth.uid() and public.user_has_location_access(location_id));

create policy notifications_manage on public.notifications
for all
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
)
with check (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy notification_preferences_select on public.notification_preferences
for select
using (
  user_id = auth.uid()
  or public.user_has_location_role(location_id, array['location_manager','trainer']::public.app_role[])
);

create policy notification_preferences_manage on public.notification_preferences
for all
using (user_id = auth.uid() or public.user_has_location_role(location_id, array['location_manager']::public.app_role[]))
with check (user_id = auth.uid() or public.user_has_location_role(location_id, array['location_manager']::public.app_role[]));

create policy audit_events_select on public.audit_events
for select
using (
  public.is_platform_admin()
  or (group_id is not null and public.user_has_group_access(group_id))
  or actor_user_id = auth.uid()
);

create policy audit_events_insert on public.audit_events
for insert
with check (
  public.is_platform_admin()
  or (group_id is not null and public.user_has_group_access(group_id))
);

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated, service_role;
