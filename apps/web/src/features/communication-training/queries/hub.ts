import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CertificationStatusItem,
  HubProfile,
  LineupNoteItem,
  MenuUpdateItem,
  RecipeListItem,
  ShiftOverview,
  StaffRoleSlug,
  TrainingModuleListItem
} from "@/src/features/communication-training/types";

type CreatorRow = {
  user_id: string;
  full_name: string | null;
};
type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function mapLegacyMembershipRoleToHubRole(role: string | null): StaffRoleSlug {
  if (!role) {
    return "staff";
  }

  if (role === "platform_admin" || role === "group_admin") {
    return "admin";
  }

  if (role === "location_manager") {
    return "manager";
  }

  if (role === "trainer") {
    return "operator";
  }

  return "staff";
}

async function getCreatorMap(
  supabase: ServerSupabase,
  userIds: string[]
): Promise<Map<string, string | null>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const { data } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", Array.from(new Set(userIds)));

  const rows = ((data ?? []) as CreatorRow[]).map(
    (row): [string, string | null] => [row.user_id, row.full_name]
  );
  return new Map(rows);
}

export async function getHubProfile(): Promise<HubProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("user_id, full_name, organization_id, location_id, staff_roles:staff_role_id(slug, name)")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = profileData as
    | {
        user_id: string;
        full_name: string | null;
        organization_id: string | null;
        location_id: string | null;
        staff_roles: { slug: string; name: string } | null;
      }
    | null;

  let legacyMembershipRole: string | null = null;

  if (!profile?.organization_id || !profile?.location_id) {
    const membershipResult = await supabase
      .from("memberships")
      .select("group_id, location_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const membership = membershipResult.data as
      | { group_id: string; location_id: string; role: string }
      | null;
    legacyMembershipRole = membership?.role ?? null;

    if (!membership) {
      return null;
    }

    return {
      userId: user.id,
      fullName: profile?.full_name ?? null,
      organizationId: profile?.organization_id ?? membership.group_id,
      locationId: profile?.location_id ?? membership.location_id,
      roleSlug: profile?.staff_roles?.slug
        ? (profile.staff_roles.slug as StaffRoleSlug)
        : mapLegacyMembershipRoleToHubRole(legacyMembershipRole),
      roleName: profile?.staff_roles?.name ?? "Staff"
    };
  }

  return {
    userId: user.id,
    fullName: profile.full_name,
    organizationId: profile.organization_id,
    locationId: profile.location_id,
    roleSlug: profile.staff_roles?.slug
      ? (profile.staff_roles.slug as StaffRoleSlug)
      : mapLegacyMembershipRoleToHubRole(legacyMembershipRole),
    roleName: profile.staff_roles?.name ?? "Staff"
  };
}

export async function getLineupNotes(profile: HubProfile): Promise<LineupNoteItem[]> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("lineup_notes")
    .select("id, title, body, shift_date, shift_period, priority, created_at, created_by")
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .eq("shift_date", today)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  const notes = (data ?? []) as {
    id: string;
    title: string;
    body: string;
    shift_date: string;
    shift_period: "am" | "pm" | "all_day";
    priority: "low" | "normal" | "high" | "critical";
    created_at: string;
    created_by: string;
  }[];

  const noteIds = notes.map((note) => note.id);
  const creatorMap = await getCreatorMap(
    supabase,
    notes.map((note) => note.created_by)
  );

  const { data: ackData } = await supabase
    .from("lineup_note_acknowledgements")
    .select("lineup_note_id")
    .eq("user_id", profile.userId)
    .in("lineup_note_id", noteIds.length > 0 ? noteIds : ["00000000-0000-0000-0000-000000000000"]);

  const acknowledgedIds = new Set(
    ((ackData ?? []) as { lineup_note_id: string }[]).map((row) => row.lineup_note_id)
  );

  return notes.map((note) => ({
    id: note.id,
    title: note.title,
    body: note.body,
    shiftDate: note.shift_date,
    shiftPeriod: note.shift_period,
    priority: note.priority,
    createdAt: note.created_at,
    createdByName: creatorMap.get(note.created_by) ?? null,
    acknowledgedByCurrentUser: acknowledgedIds.has(note.id)
  }));
}

export async function getMenuUpdates(profile: HubProfile): Promise<MenuUpdateItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("menu_updates")
    .select("id, headline, details, update_type, effective_from, created_by, menu_items(name)")
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .eq("is_active", true)
    .lte("effective_from", new Date().toISOString())
    .order("effective_from", { ascending: false })
    .limit(20);

  const updates = (data ?? []) as {
    id: string;
    headline: string;
    details: string | null;
    update_type: string;
    effective_from: string;
    created_by: string;
    menu_items: { name: string } | { name: string }[] | null;
  }[];

  const creatorMap = await getCreatorMap(
    supabase,
    updates.map((update) => update.created_by)
  );

  return updates.map((update) => {
    const menuItem = Array.isArray(update.menu_items) ? update.menu_items[0] : update.menu_items;

    return {
      id: update.id,
      headline: update.headline,
      details: update.details,
      updateType: update.update_type,
      effectiveFrom: update.effective_from,
      itemName: menuItem?.name ?? "Menu item",
      createdByName: creatorMap.get(update.created_by) ?? null
    };
  });
}

export async function getMenuItemsForLocation(
  profile: HubProfile
): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("menu_items")
    .select("id, name")
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(100);

  return ((data ?? []) as { id: string; name: string }[]).map((row) => ({
    id: row.id,
    name: row.name
  }));
}

export async function getRecipeLibrary(
  profile: HubProfile,
  searchTerm?: string
): Promise<RecipeListItem[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("recipes")
    .select("id, name, station, prep_time_minutes, ingredients, method, notes, created_at, menu_items(name)")
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .order("name", { ascending: true });

  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.trim().replaceAll(",", " ");
    query = query.or(
      `name.ilike.%${term}%,ingredients.ilike.%${term}%,method.ilike.%${term}%,notes.ilike.%${term}%`
    );
  }

  const { data } = await query.limit(100);

  const recipes = (data ?? []) as {
    id: string;
    name: string;
    station: string | null;
    prep_time_minutes: number | null;
    ingredients: string;
    method: string;
    notes: string | null;
    created_at: string;
    menu_items: { name: string } | { name: string }[] | null;
  }[];

  return recipes.map((recipe) => {
    const menuItem = Array.isArray(recipe.menu_items) ? recipe.menu_items[0] : recipe.menu_items;

    return {
      id: recipe.id,
      name: recipe.name,
      station: recipe.station,
      prepTimeMinutes: recipe.prep_time_minutes,
      ingredients: recipe.ingredients,
      method: recipe.method,
      notes: recipe.notes,
      menuItemName: menuItem?.name ?? null,
      createdAt: recipe.created_at
    };
  });
}

export async function getRoleFilters(
  profile: HubProfile
): Promise<Array<{ slug: string; name: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("staff_roles")
    .select("slug, name")
    .eq("organization_id", profile.organizationId)
    .order("sort_order", { ascending: true });

  return ((data ?? []) as { slug: string; name: string }[]).map((row) => ({
    slug: row.slug,
    name: row.name
  }));
}

export async function getTrainingModules(
  profile: HubProfile,
  roleFilter: string | null = null
): Promise<TrainingModuleListItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("training_modules")
    .select(
      "id, title, description, estimated_minutes, is_featured, target_staff_role_id, staff_roles:target_staff_role_id(name, slug)"
    )
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(50);

  const modules = (data ?? []) as {
    id: string;
    title: string;
    description: string | null;
    estimated_minutes: number | null;
    is_featured: boolean;
    target_staff_role_id: string | null;
    staff_roles: { name: string; slug: string } | { name: string; slug: string }[] | null;
  }[];

  const moduleIds = modules.map((module) => module.id);
  const { data: sectionData } = await supabase
    .from("training_module_sections")
    .select("training_module_id")
    .in("training_module_id", moduleIds.length > 0 ? moduleIds : ["00000000-0000-0000-0000-000000000000"]);

  const sectionCountMap = new Map<string, number>();
  ((sectionData ?? []) as { training_module_id: string }[]).forEach((section) => {
    const current = sectionCountMap.get(section.training_module_id) ?? 0;
    sectionCountMap.set(section.training_module_id, current + 1);
  });

  const normalized = modules.map((module) => {
    const targetRole = Array.isArray(module.staff_roles) ? module.staff_roles[0] : module.staff_roles;

    return {
      id: module.id,
      title: module.title,
      description: module.description,
      estimatedMinutes: module.estimated_minutes,
      isFeatured: module.is_featured,
      targetRoleName: targetRole?.name ?? null,
      targetRoleSlug: targetRole?.slug ?? null,
      sectionCount: sectionCountMap.get(module.id) ?? 0
    };
  });

  if (!roleFilter || roleFilter === "all") {
    return normalized;
  }

  return normalized.filter((module) => module.targetRoleSlug === roleFilter);
}

export async function getStaffCertificationStatuses(
  profile: HubProfile
): Promise<CertificationStatusItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("staff_certifications")
    .select("id, status, completed_at, expires_at, certifications(name)")
    .eq("organization_id", profile.organizationId)
    .eq("location_id", profile.locationId)
    .eq("staff_user_id", profile.userId)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as {
    id: string;
    status: "pending" | "completed" | "expired";
    completed_at: string | null;
    expires_at: string | null;
    certifications: { name: string } | { name: string }[] | null;
  }[];

  return rows.map((row) => {
    const certification = Array.isArray(row.certifications) ? row.certifications[0] : row.certifications;

    return {
      id: row.id,
      certificationName: certification?.name ?? "Certification",
      status: row.status,
      completedAt: row.completed_at,
      expiresAt: row.expires_at
    };
  });
}

export async function getShiftOverview(profile: HubProfile): Promise<ShiftOverview> {
  const [lineupNotes, menuUpdates, featuredTraining, certifications] = await Promise.all([
    getLineupNotes(profile),
    getMenuUpdates(profile),
    getTrainingModules(profile),
    getStaffCertificationStatuses(profile)
  ]);

  const certificationSummary = {
    completed: certifications.filter((item) => item.status === "completed").length,
    pending: certifications.filter((item) => item.status === "pending").length,
    expired: certifications.filter((item) => item.status === "expired").length
  };

  return {
    profile,
    lineupNotes,
    menuUpdates,
    featuredTraining: featuredTraining.filter((module) => module.isFeatured).slice(0, 3),
    certificationSummary
  };
}
