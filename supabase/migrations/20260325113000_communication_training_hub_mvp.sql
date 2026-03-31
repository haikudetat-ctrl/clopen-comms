begin;

-- Communication & Training Hub MVP schema additions.
-- This migration is additive: it introduces module tables and extends overlapping tables
-- from earlier schema work without destructive changes.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 100,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

-- Bring forward groups as organizations when groups already exist.
insert into public.organizations (id, slug, name, created_at, updated_at)
select g.id, g.slug, g.name, g.created_at, g.updated_at
from public.groups g
on conflict (id) do nothing;

alter table public.locations add column if not exists organization_id uuid;
alter table public.locations add column if not exists created_by uuid references auth.users (id);

update public.locations
set organization_id = group_id
where organization_id is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'locations_organization_id_fkey'
  ) then
    alter table public.locations
      add constraint locations_organization_id_fkey
      foreign key (organization_id) references public.organizations (id) on delete set null;
  end if;
end $$;

create index if not exists locations_organization_idx on public.locations (organization_id);

alter table public.profiles add column if not exists organization_id uuid;
alter table public.profiles add column if not exists location_id uuid;
alter table public.profiles add column if not exists staff_role_id uuid;
alter table public.profiles add column if not exists created_by uuid references auth.users (id);

update public.profiles p
set organization_id = m.group_id,
    location_id = m.location_id
from (
  select distinct on (user_id)
    user_id,
    group_id,
    location_id
  from public.memberships
  where status = 'active'
  order by user_id, updated_at desc
) m
where p.user_id = m.user_id
  and (p.organization_id is null or p.location_id is null);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_organization_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_organization_id_fkey
      foreign key (organization_id) references public.organizations (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_location_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_location_id_fkey
      foreign key (location_id) references public.locations (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_staff_role_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_staff_role_id_fkey
      foreign key (staff_role_id) references public.staff_roles (id) on delete set null;
  end if;
end $$;

create index if not exists profiles_organization_idx on public.profiles (organization_id);
create index if not exists profiles_location_idx on public.profiles (location_id);
create index if not exists profiles_staff_role_idx on public.profiles (staff_role_id);

create table if not exists public.lineup_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  shift_date date not null,
  shift_period text not null default 'all_day' check (shift_period in ('am', 'pm', 'all_day')),
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lineup_note_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  lineup_note_id uuid not null references public.lineup_notes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lineup_note_id, user_id)
);

alter table public.menu_items add column if not exists organization_id uuid;
alter table public.menu_items add column if not exists station text;
alter table public.menu_items add column if not exists created_by uuid references auth.users (id);

update public.menu_items
set organization_id = group_id
where organization_id is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_organization_id_fkey'
  ) then
    alter table public.menu_items
      add constraint menu_items_organization_id_fkey
      foreign key (organization_id) references public.organizations (id) on delete set null;
  end if;
end $$;

create index if not exists menu_items_organization_idx on public.menu_items (organization_id);

create table if not exists public.menu_updates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  update_type text not null default 'prep_change'
    check (update_type in ('added', 'removed', 'price_change', 'prep_change', 'allergy_alert', 'sold_out', 'other')),
  headline text not null,
  details text,
  effective_from timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name text not null,
  station text,
  prep_time_minutes int,
  ingredients text not null,
  method text not null,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.training_modules add column if not exists organization_id uuid;
alter table public.training_modules add column if not exists target_staff_role_id uuid;
alter table public.training_modules add column if not exists is_featured boolean not null default false;
alter table public.training_modules add column if not exists created_by uuid references auth.users (id);

update public.training_modules
set organization_id = group_id
where organization_id is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'training_modules_organization_id_fkey'
  ) then
    alter table public.training_modules
      add constraint training_modules_organization_id_fkey
      foreign key (organization_id) references public.organizations (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'training_modules_target_staff_role_id_fkey'
  ) then
    alter table public.training_modules
      add constraint training_modules_target_staff_role_id_fkey
      foreign key (target_staff_role_id) references public.staff_roles (id) on delete set null;
  end if;
end $$;

create index if not exists training_modules_organization_idx on public.training_modules (organization_id);
create index if not exists training_modules_target_role_idx on public.training_modules (target_staff_role_id);

create table if not exists public.training_module_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  training_module_id uuid not null references public.training_modules (id) on delete cascade,
  title text not null,
  body text not null,
  sort_order int not null default 1,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.certifications add column if not exists organization_id uuid;
alter table public.certifications add column if not exists target_staff_role_id uuid;
alter table public.certifications add column if not exists validity_days int;
alter table public.certifications add column if not exists is_required boolean not null default true;
alter table public.certifications add column if not exists created_by uuid references auth.users (id);

update public.certifications
set organization_id = group_id
where organization_id is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'certifications_organization_id_fkey'
  ) then
    alter table public.certifications
      add constraint certifications_organization_id_fkey
      foreign key (organization_id) references public.organizations (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'certifications_target_staff_role_id_fkey'
  ) then
    alter table public.certifications
      add constraint certifications_target_staff_role_id_fkey
      foreign key (target_staff_role_id) references public.staff_roles (id) on delete set null;
  end if;
end $$;

create index if not exists certifications_organization_idx on public.certifications (organization_id);
create index if not exists certifications_target_role_idx on public.certifications (target_staff_role_id);

create table if not exists public.staff_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  certification_id uuid not null references public.certifications (id) on delete cascade,
  staff_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed', 'expired')),
  completed_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location_id, certification_id, staff_user_id)
);

create index if not exists lineup_notes_location_shift_idx
  on public.lineup_notes (location_id, shift_date desc, created_at desc);
create index if not exists menu_updates_location_idx
  on public.menu_updates (location_id, is_active, effective_from desc);
create index if not exists recipes_location_name_idx
  on public.recipes (location_id, name);
create index if not exists training_module_sections_module_idx
  on public.training_module_sections (training_module_id, sort_order);
create index if not exists staff_certifications_staff_idx
  on public.staff_certifications (staff_user_id, status);

-- Add updated_at auto-touch triggers for new tables.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_organizations_touch on public.organizations;
create trigger trg_organizations_touch before update on public.organizations
for each row execute function public.touch_updated_at();

drop trigger if exists trg_staff_roles_touch on public.staff_roles;
create trigger trg_staff_roles_touch before update on public.staff_roles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_lineup_notes_touch on public.lineup_notes;
create trigger trg_lineup_notes_touch before update on public.lineup_notes
for each row execute function public.touch_updated_at();

drop trigger if exists trg_lineup_note_acknowledgements_touch on public.lineup_note_acknowledgements;
create trigger trg_lineup_note_acknowledgements_touch before update on public.lineup_note_acknowledgements
for each row execute function public.touch_updated_at();

drop trigger if exists trg_menu_updates_touch on public.menu_updates;
create trigger trg_menu_updates_touch before update on public.menu_updates
for each row execute function public.touch_updated_at();

drop trigger if exists trg_recipes_touch on public.recipes;
create trigger trg_recipes_touch before update on public.recipes
for each row execute function public.touch_updated_at();

drop trigger if exists trg_training_module_sections_touch on public.training_module_sections;
create trigger trg_training_module_sections_touch before update on public.training_module_sections
for each row execute function public.touch_updated_at();

drop trigger if exists trg_staff_certifications_touch on public.staff_certifications;
create trigger trg_staff_certifications_touch before update on public.staff_certifications
for each row execute function public.touch_updated_at();

-- RLS coverage for module tables.
alter table public.organizations enable row level security;
alter table public.staff_roles enable row level security;
alter table public.lineup_notes enable row level security;
alter table public.lineup_note_acknowledgements enable row level security;
alter table public.menu_updates enable row level security;
alter table public.recipes enable row level security;
alter table public.training_module_sections enable row level security;
alter table public.staff_certifications enable row level security;

create or replace function public.ct_can_manage_location(target_location uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_location_role(
    target_location,
    array['group_admin', 'location_manager', 'trainer']::public.app_role[]
  );
$$;

-- Organizations and roles
create policy organizations_select on public.organizations
for select
using (public.user_has_group_access(id));

create policy organizations_manage on public.organizations
for all
using (public.user_is_group_admin(id) or public.is_platform_admin())
with check (public.user_is_group_admin(id) or public.is_platform_admin());

create policy staff_roles_select on public.staff_roles
for select
using (public.user_has_group_access(organization_id));

create policy staff_roles_manage on public.staff_roles
for all
using (public.user_is_group_admin(organization_id) or public.is_platform_admin())
with check (public.user_is_group_admin(organization_id) or public.is_platform_admin());

-- Lineup
create policy lineup_notes_select on public.lineup_notes
for select
using (public.user_has_location_access(location_id));

create policy lineup_notes_manage on public.lineup_notes
for all
using (public.ct_can_manage_location(location_id))
with check (public.ct_can_manage_location(location_id));

create policy lineup_note_ack_select on public.lineup_note_acknowledgements
for select
using (
  exists (
    select 1
    from public.lineup_notes ln
    where ln.id = lineup_note_id
      and public.user_has_location_access(ln.location_id)
  )
);

create policy lineup_note_ack_insert on public.lineup_note_acknowledgements
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.lineup_notes ln
    where ln.id = lineup_note_id
      and public.user_has_location_access(ln.location_id)
  )
);

create policy lineup_note_ack_manage on public.lineup_note_acknowledgements
for update
using (
  exists (
    select 1
    from public.lineup_notes ln
    where ln.id = lineup_note_id
      and public.ct_can_manage_location(ln.location_id)
  )
)
with check (
  exists (
    select 1
    from public.lineup_notes ln
    where ln.id = lineup_note_id
      and public.ct_can_manage_location(ln.location_id)
  )
);

-- Menu updates history
create policy menu_updates_select on public.menu_updates
for select
using (public.user_has_location_access(location_id));

create policy menu_updates_manage on public.menu_updates
for all
using (public.ct_can_manage_location(location_id))
with check (public.ct_can_manage_location(location_id));

-- Recipes
create policy recipes_select on public.recipes
for select
using (public.user_has_location_access(location_id));

create policy recipes_manage on public.recipes
for all
using (public.ct_can_manage_location(location_id))
with check (public.ct_can_manage_location(location_id));

-- Training sections
create policy training_module_sections_select on public.training_module_sections
for select
using (public.user_has_location_access(location_id));

create policy training_module_sections_manage on public.training_module_sections
for all
using (public.ct_can_manage_location(location_id))
with check (public.ct_can_manage_location(location_id));

-- Staff certifications
create policy staff_certifications_select on public.staff_certifications
for select
using (
  staff_user_id = auth.uid()
  or public.ct_can_manage_location(location_id)
  or public.user_has_location_access(location_id)
);

create policy staff_certifications_manage on public.staff_certifications
for all
using (public.ct_can_manage_location(location_id))
with check (public.ct_can_manage_location(location_id));

commit;
