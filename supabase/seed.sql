-- Communication & Training Hub MVP seed data
-- Assumptions for local demo:
-- 1) Create these auth users first in Supabase Auth:
--    - admin@ateliergroup.com / Password123!
--    - staff@ateliermidtown.com / Password123!
-- 2) Organization id mirrors group id for compatibility with existing group-based RLS helpers.

begin;

insert into public.groups (id, name, slug)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Atelier Hospitality Group', 'atelier-group')
on conflict (id) do update
set name = excluded.name, slug = excluded.slug;

insert into public.restaurants (id, group_id, name, slug)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Atelier',
  'atelier'
)
on conflict (id) do update
set name = excluded.name, slug = excluded.slug;

insert into public.organizations (id, slug, name)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'atelier-group', 'Atelier Hospitality Group')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name;

insert into public.locations (
  id,
  group_id,
  restaurant_id,
  organization_id,
  name,
  slug,
  timezone,
  city,
  state_region,
  country_code
)
values
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Atelier Midtown',
    'midtown',
    'America/New_York',
    'New York',
    'NY',
    'US'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Atelier Brooklyn',
    'brooklyn',
    'America/New_York',
    'Brooklyn',
    'NY',
    'US'
  )
on conflict (id) do update
set
  organization_id = excluded.organization_id,
  name = excluded.name,
  slug = excluded.slug,
  timezone = excluded.timezone,
  city = excluded.city,
  state_region = excluded.state_region,
  country_code = excluded.country_code;

insert into public.staff_roles (id, organization_id, slug, name, description, sort_order)
values
  ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'Admin', 'Full control of organization configuration and staffing.', 1),
  ('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'operator', 'Operator', 'Can manage all shift content across locations.', 2),
  ('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'manager', 'Manager', 'Can publish lineup notes, menu updates, and training content.', 3),
  ('10000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'staff', 'Staff', 'Consumes shift content and training assignments.', 4)
on conflict (organization_id, slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

do $$
declare
  admin_user_id uuid;
  auth_staff_user_id uuid;
begin
  select id into admin_user_id
  from auth.users
  where email = 'admin@ateliergroup.com'
  order by created_at desc
  limit 1;

  select id into auth_staff_user_id
  from auth.users
  where email = 'staff@ateliermidtown.com'
  order by created_at desc
  limit 1;

  if admin_user_id is null or auth_staff_user_id is null then
    raise exception 'Required auth users not found. Create admin@ateliergroup.com and staff@ateliermidtown.com in Supabase Auth first.';
  end if;

  insert into public.profiles (
    user_id,
    email,
    full_name,
    is_platform_admin,
    organization_id,
    location_id,
    staff_role_id
  )
  values
    (
      admin_user_id,
      'admin@ateliergroup.com',
      'Lea Moreau',
      true,
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '10000000-0000-0000-0000-000000000003'
    ),
    (
      auth_staff_user_id,
      'staff@ateliermidtown.com',
      'Marco Ruiz',
      false,
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '10000000-0000-0000-0000-000000000004'
    )
  on conflict (user_id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    is_platform_admin = excluded.is_platform_admin,
    organization_id = excluded.organization_id,
    location_id = excluded.location_id,
    staff_role_id = excluded.staff_role_id;

  insert into public.group_memberships (group_id, user_id, role, status)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', admin_user_id, 'group_admin', 'active')
  on conflict (group_id, user_id) do update
  set role = excluded.role,
      status = excluded.status;

  insert into public.memberships (group_id, location_id, user_id, role, status)
  values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', admin_user_id, 'location_manager', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', auth_staff_user_id, 'staff', 'active')
  on conflict (location_id, user_id) do update
  set role = excluded.role,
      status = excluded.status;

  insert into public.menu_categories (id, group_id, location_id, name, sort_order)
  values
    ('0ca11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Dinner', 1),
    ('0ca22222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bar Program', 2)
  on conflict (id) do update
  set name = excluded.name,
      sort_order = excluded.sort_order;

  insert into public.menu_items (
    id,
    group_id,
    location_id,
    organization_id,
    category_id,
    name,
    menu_description,
    chef_notes,
    tableside_description,
    seasonal_tag,
    pos_reference,
    station,
    created_by,
    is_active
  )
  values
    (
      '0d111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      '0ca11111-1111-1111-1111-111111111111',
      'Dry-Aged Duck Breast',
      'Cherry lacquer, charred chicory, fermented black garlic jus.',
      'Rest protein 5 minutes before slicing for pass consistency.',
      'Rich duck balanced by bitter greens and cherry acidity.',
      'Spring 2026',
      'DUCK-DRY-01',
      'hot-line',
      admin_user_id,
      true
    ),
    (
      '0d222222-2222-2222-2222-222222222222',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      '0ca11111-1111-1111-1111-111111111111',
      'Crudo of Hamachi',
      'Yuzu kosho, shaved fennel, cucumber consommé.',
      'Plate chilled to preserve texture and aromatic lift.',
      'Cool first course highlighting delicate ocean sweetness.',
      'Spring 2026',
      'HAMACHI-CRUDO-01',
      'garde-manger',
      admin_user_id,
      true
    ),
    (
      '0d333333-3333-3333-3333-333333333333',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      '0ca22222-2222-2222-2222-222222222222',
      'Smoked Citrus Spritz',
      'Aperitivo, citrus cordial, smoked rosemary.',
      'Build over large cube and torch rosemary garnish tableside.',
      'Bright, aromatic low-ABV opener.',
      'Spring 2026',
      'SPRITZ-SMK-01',
      'bar',
      admin_user_id,
      true
    )
  on conflict (id) do update
  set
    organization_id = excluded.organization_id,
    category_id = excluded.category_id,
    name = excluded.name,
    menu_description = excluded.menu_description,
    chef_notes = excluded.chef_notes,
    tableside_description = excluded.tableside_description,
    seasonal_tag = excluded.seasonal_tag,
    pos_reference = excluded.pos_reference,
    station = excluded.station,
    created_by = excluded.created_by,
    is_active = excluded.is_active;

  insert into public.menu_updates (
    id,
    organization_id,
    location_id,
    menu_item_id,
    update_type,
    headline,
    details,
    effective_from,
    is_active,
    created_by
  )
  values
    (
      '20000000-0000-0000-0000-000000000001',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '0d111111-1111-1111-1111-111111111111',
      'prep_change',
      'Duck fire timing tightened for peak volume',
      'All duck tickets now fire at 9 minutes to preserve pick-up consistency during 7:00-8:30 rush.',
      now() - interval '4 hours',
      true,
      admin_user_id
    ),
    (
      '20000000-0000-0000-0000-000000000002',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '0d222222-2222-2222-2222-222222222222',
      'allergy_alert',
      'Hamachi crudo now includes sesame finishing oil',
      'Flag sesame allergy guests and offer smoked cucumber substitute garnish.',
      now() - interval '2 hours',
      true,
      admin_user_id
    ),
    (
      '20000000-0000-0000-0000-000000000003',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '0d333333-3333-3333-3333-333333333333',
      'sold_out',
      'Smoked Citrus Spritz prep is 86 after 9:30 PM',
      'After 9:30 PM, direct guests to the Alpine Highball feature.',
      now() - interval '1 hour',
      true,
      admin_user_id
    )
  on conflict (id) do update
  set
    update_type = excluded.update_type,
    headline = excluded.headline,
    details = excluded.details,
    effective_from = excluded.effective_from,
    is_active = excluded.is_active,
    created_by = excluded.created_by;

  insert into public.recipes (
    id,
    organization_id,
    location_id,
    menu_item_id,
    name,
    station,
    prep_time_minutes,
    ingredients,
    method,
    notes,
    created_by
  )
  values
    (
      '30000000-0000-0000-0000-000000000001',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '0d111111-1111-1111-1111-111111111111',
      'Duck Breast Base Prep',
      'hot-line',
      35,
      'Duck breast; cherry glaze; black garlic jus; chicory; finishing salt',
      'Score skin, temper 20 minutes, render skin side until crisp, roast to medium, rest, slice, glaze to order.',
      'Core standard: hold in resting rack no longer than 7 minutes.',
      admin_user_id
    ),
    (
      '30000000-0000-0000-0000-000000000002',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '0d333333-3333-3333-3333-333333333333',
      'Smoked Citrus Spritz Build',
      'bar',
      4,
      'Aperitivo; citrus cordial; dry sparkling wine; rosemary sprig; large ice cube',
      'Build in stemmed glass over large cube, top with sparkling wine, lightly torch rosemary and express oils.',
      'For zero-proof variation, swap aperitivo for bitter orange cordial.',
      admin_user_id
    )
  on conflict (id) do update
  set
    name = excluded.name,
    station = excluded.station,
    prep_time_minutes = excluded.prep_time_minutes,
    ingredients = excluded.ingredients,
    method = excluded.method,
    notes = excluded.notes,
    created_by = excluded.created_by;

  insert into public.training_programs (id, group_id, location_id, name, description, is_required)
  values
    (
      'da111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'Shift Readiness Foundations',
      'Operational standards for opening, lineup execution, and menu communication.',
      true
    )
  on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      is_required = excluded.is_required;

  insert into public.training_modules (
    id,
    group_id,
    location_id,
    organization_id,
    program_id,
    title,
    description,
    sort_order,
    estimated_minutes,
    target_staff_role_id,
    is_featured,
    created_by
  )
  values
    (
      'ea111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'da111111-1111-1111-1111-111111111111',
      'Daily Lineup Execution',
      'How to absorb lineup notes fast and execute updates during service.',
      1,
      18,
      '10000000-0000-0000-0000-000000000004',
      true,
      admin_user_id
    ),
    (
      'ea222222-2222-2222-2222-222222222222',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'da111111-1111-1111-1111-111111111111',
      'Menu Storytelling for Managers',
      'Coach staff to translate chef notes into clear guest-facing language.',
      2,
      24,
      '10000000-0000-0000-0000-000000000003',
      false,
      admin_user_id
    )
  on conflict (id) do update
  set
    organization_id = excluded.organization_id,
    title = excluded.title,
    description = excluded.description,
    sort_order = excluded.sort_order,
    estimated_minutes = excluded.estimated_minutes,
    target_staff_role_id = excluded.target_staff_role_id,
    is_featured = excluded.is_featured,
    created_by = excluded.created_by;

  insert into public.training_module_sections (
    id,
    organization_id,
    location_id,
    training_module_id,
    title,
    body,
    sort_order,
    created_by
  )
  values
    (
      '40000000-0000-0000-0000-000000000001',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'ea111111-1111-1111-1111-111111111111',
      'What to read first in lineup',
      'Start with menu changes, allergy alerts, and VIP notes before anything else.',
      1,
      admin_user_id
    ),
    (
      '40000000-0000-0000-0000-000000000002',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'ea111111-1111-1111-1111-111111111111',
      'How to confirm understanding',
      'Use a 30-second read-back with your section partner before floor open.',
      2,
      admin_user_id
    ),
    (
      '40000000-0000-0000-0000-000000000003',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'ea222222-2222-2222-2222-222222222222',
      'Talk track structure',
      'Flavor, texture, and provenance in that order; keep each course under 20 seconds.',
      1,
      admin_user_id
    )
  on conflict (id) do update
  set
    title = excluded.title,
    body = excluded.body,
    sort_order = excluded.sort_order,
    created_by = excluded.created_by;

  insert into public.certifications (
    id,
    group_id,
    location_id,
    organization_id,
    name,
    description,
    target_staff_role_id,
    validity_days,
    is_required,
    created_by
  )
  values
    (
      'cf111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Lineup Readiness',
      'Confirms team member can interpret and execute daily lineup updates accurately.',
      '10000000-0000-0000-0000-000000000004',
      180,
      true,
      admin_user_id
    ),
    (
      'cf222222-2222-2222-2222-222222222222',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Menu Knowledge Level 1',
      'Validates core dish and beverage knowledge for guest conversations.',
      '10000000-0000-0000-0000-000000000004',
      365,
      true,
      admin_user_id
    )
  on conflict (id) do update
  set
    organization_id = excluded.organization_id,
    name = excluded.name,
    description = excluded.description,
    target_staff_role_id = excluded.target_staff_role_id,
    validity_days = excluded.validity_days,
    is_required = excluded.is_required,
    created_by = excluded.created_by;

  insert into public.staff_certifications (
    id,
    organization_id,
    location_id,
    certification_id,
    staff_user_id,
    status,
    completed_at,
    expires_at,
    created_by
  )
  values
    (
      '50000000-0000-0000-0000-000000000001',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'cf111111-1111-1111-1111-111111111111',
      auth_staff_user_id,
      'completed',
      now() - interval '30 days',
      now() + interval '150 days',
      admin_user_id
    ),
    (
      '50000000-0000-0000-0000-000000000002',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'cf222222-2222-2222-2222-222222222222',
      auth_staff_user_id,
      'pending',
      null,
      null,
      admin_user_id
    )
  on conflict (location_id, certification_id, staff_user_id) do update
  set
    status = excluded.status,
    completed_at = excluded.completed_at,
    expires_at = excluded.expires_at,
    created_by = excluded.created_by;

  insert into public.lineup_notes (
    id,
    organization_id,
    location_id,
    shift_date,
    shift_period,
    title,
    body,
    priority,
    created_by
  )
  values
    (
      '60000000-0000-0000-0000-000000000001',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      current_date,
      'pm',
      'Dinner lineup: pacing and allergy focus',
      'Tonight focus: maintain 12-minute fire cadence on entree course. Table 42 has shellfish + sesame alert. Push smoked citrus spritz pairing before first bite.',
      'critical',
      admin_user_id
    ),
    (
      '60000000-0000-0000-0000-000000000002',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      current_date,
      'pm',
      'Pre-shift callouts',
      'Recite one menu change during lineup huddle. Confirm every section has allergy card markers before first seating.',
      'high',
      admin_user_id
    )
  on conflict (id) do update
  set
    shift_date = excluded.shift_date,
    shift_period = excluded.shift_period,
    title = excluded.title,
    body = excluded.body,
    priority = excluded.priority,
    created_by = excluded.created_by;

  insert into public.lineup_note_acknowledgements (
    id,
    lineup_note_id,
    user_id,
    acknowledged_at
  )
  values
    (
      '70000000-0000-0000-0000-000000000001',
      '60000000-0000-0000-0000-000000000001',
      auth_staff_user_id,
      now() - interval '45 minutes'
    )
  on conflict (lineup_note_id, user_id) do update
  set acknowledged_at = excluded.acknowledged_at;
end $$;

commit;
