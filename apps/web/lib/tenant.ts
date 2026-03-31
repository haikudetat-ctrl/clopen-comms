import type { ActiveMembership, BrandSettings, TenantContext } from "@clopen/types";
import type { Database } from "@clopen/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultBrand: BrandSettings = {
  brand_name: "Atelier Group",
  logo_url: null,
  primary_color: "#173A2A",
  accent_color: "#A67C2B",
  surface_color: "#FFFCF7",
  typeface_heading: "Cormorant Garamond",
  typeface_body: "Manrope"
};

export async function getTenantContext(): Promise<TenantContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      activeMembership: null,
      brand: defaultBrand
    };
  }

  const membershipResult = await supabase
    .from("memberships")
    .select("id, role, status, location_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  const membership = membershipResult.data as ActiveMembership | null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, full_name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return {
      profile,
      activeMembership: null,
      brand: defaultBrand
    };
  }

  type LocationRow = {
    id: string;
    group_id: string;
    restaurant_id: string;
  };

  const locationResult = await supabase
    .from("locations")
    .select("id, group_id, restaurant_id")
    .eq("id", membership.location_id)
    .maybeSingle();
  const location = locationResult.data as LocationRow | null;

  if (!location) {
    return {
      profile,
      activeMembership: membership,
      brand: defaultBrand
    };
  }

  type BrandRow = Pick<
    Database["public"]["Tables"]["brand_settings"]["Row"],
    | "scope"
    | "brand_name"
    | "logo_url"
    | "primary_color"
    | "accent_color"
    | "surface_color"
    | "typeface_heading"
    | "typeface_body"
  >;

  const brandRowsResult = await supabase
    .from("brand_settings")
    .select(
      "scope, brand_name, logo_url, primary_color, accent_color, surface_color, typeface_heading, typeface_body"
    )
    .or(
      `location_id.eq.${location.id},restaurant_id.eq.${location.restaurant_id},group_id.eq.${location.group_id}`
    );
  const typedBrandRows = (brandRowsResult.data ?? []) as BrandRow[];

  const brand =
    typedBrandRows.find((row) => row.scope === "location") ??
    typedBrandRows.find((row) => row.scope === "restaurant") ??
    typedBrandRows.find((row) => row.scope === "group") ??
    null;

  return {
    profile,
    activeMembership: membership,
    brand: brand ?? defaultBrand
  };
}
