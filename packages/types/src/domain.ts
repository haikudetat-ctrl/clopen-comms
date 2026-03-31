export type AppRole =
  | "platform_admin"
  | "group_admin"
  | "location_manager"
  | "trainer"
  | "staff";

export type MembershipStatus = "invited" | "active" | "suspended";

export type ActiveMembership = {
  id: string;
  role: AppRole;
  status: MembershipStatus;
  location_id: string;
};

export type BrandSettings = {
  brand_name: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  surface_color: string;
  typeface_heading: string;
  typeface_body: string;
};

export type PermissionKey =
  | "group.manage"
  | "location.manage"
  | "users.invite"
  | "users.role_assign"
  | "menu.manage"
  | "beverage.manage"
  | "training.manage"
  | "signoff.approve"
  | "lineup.publish"
  | "board.publish"
  | "progress.view"
  | "branding.manage";

export const ROLE_PERMISSIONS: Record<AppRole, PermissionKey[]> = {
  platform_admin: [
    "group.manage",
    "location.manage",
    "users.invite",
    "users.role_assign",
    "menu.manage",
    "beverage.manage",
    "training.manage",
    "signoff.approve",
    "lineup.publish",
    "board.publish",
    "progress.view",
    "branding.manage"
  ],
  group_admin: [
    "group.manage",
    "location.manage",
    "users.invite",
    "users.role_assign",
    "menu.manage",
    "beverage.manage",
    "training.manage",
    "signoff.approve",
    "lineup.publish",
    "board.publish",
    "progress.view",
    "branding.manage"
  ],
  location_manager: [
    "location.manage",
    "users.invite",
    "users.role_assign",
    "menu.manage",
    "beverage.manage",
    "training.manage",
    "signoff.approve",
    "lineup.publish",
    "board.publish",
    "progress.view"
  ],
  trainer: [
    "menu.manage",
    "beverage.manage",
    "training.manage",
    "signoff.approve",
    "lineup.publish",
    "board.publish",
    "progress.view"
  ],
  staff: []
};

export type TenantContext = {
  profile: {
    user_id: string;
    full_name: string | null;
    email: string;
  } | null;
  activeMembership: ActiveMembership | null;
  brand: BrandSettings;
};
