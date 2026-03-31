"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHubProfile } from "@/src/features/communication-training/queries/hub";

type MutationResult = Promise<{ error: { message: string } | null }>;
type MutationQuery = {
  insert: (values: Record<string, unknown>) => MutationResult;
  upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => MutationResult;
};
type MutationClient = {
  from: (table: string) => MutationQuery;
};

function isManagerRole(role: string): boolean {
  return role === "admin" || role === "operator" || role === "manager";
}

export async function createLineupNoteAction(formData: FormData) {
  const profile = await getHubProfile();

  if (!profile || !isManagerRole(profile.roleSlug)) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const shiftDate = String(formData.get("shift_date") ?? "").trim();
  const shiftPeriod = String(formData.get("shift_period") ?? "all_day").trim();
  const priority = String(formData.get("priority") ?? "normal").trim();

  if (!title || !body || !shiftDate) {
    return;
  }

  const supabase = (await createSupabaseServerClient()) as unknown as MutationClient;
  const { error } = await supabase.from("lineup_notes").insert({
    organization_id: profile.organizationId,
    location_id: profile.locationId,
    shift_date: shiftDate,
    shift_period: shiftPeriod,
    title,
    body,
    priority,
    created_by: profile.userId
  });

  if (error) {
    return;
  }

  revalidatePath("/app");
  revalidatePath("/app/communication-training");
  revalidatePath("/app/communication-training/lineup");

  return;
}

export async function acknowledgeLineupNoteAction(formData: FormData) {
  const profile = await getHubProfile();

  if (!profile) {
    return;
  }

  const lineupNoteId = String(formData.get("lineup_note_id") ?? "").trim();

  if (!lineupNoteId) {
    return;
  }

  const supabase = (await createSupabaseServerClient()) as unknown as MutationClient;
  const { error } = await supabase.from("lineup_note_acknowledgements").upsert(
    {
      lineup_note_id: lineupNoteId,
      user_id: profile.userId,
      acknowledged_at: new Date().toISOString()
    },
    { onConflict: "lineup_note_id,user_id" }
  );

  if (error) {
    return;
  }

  revalidatePath("/app");
  revalidatePath("/app/communication-training");
  revalidatePath("/app/communication-training/lineup");

  return;
}

export async function createMenuUpdateAction(formData: FormData) {
  const profile = await getHubProfile();

  if (!profile || !isManagerRole(profile.roleSlug)) {
    return;
  }

  const menuItemId = String(formData.get("menu_item_id") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const updateType = String(formData.get("update_type") ?? "prep_change").trim();

  if (!menuItemId || !headline) {
    return;
  }

  const supabase = (await createSupabaseServerClient()) as unknown as MutationClient;
  const { error } = await supabase.from("menu_updates").insert({
    organization_id: profile.organizationId,
    location_id: profile.locationId,
    menu_item_id: menuItemId,
    update_type: updateType,
    headline,
    details: details || null,
    created_by: profile.userId,
    effective_from: new Date().toISOString(),
    is_active: true
  });

  if (error) {
    return;
  }

  revalidatePath("/app");
  revalidatePath("/app/communication-training");
  revalidatePath("/app/communication-training/menu-updates");

  return;
}
