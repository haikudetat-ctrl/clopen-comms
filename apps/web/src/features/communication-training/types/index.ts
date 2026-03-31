export type StaffRoleSlug = "admin" | "operator" | "manager" | "staff";

export type HubProfile = {
  userId: string;
  fullName: string | null;
  organizationId: string;
  locationId: string;
  roleSlug: StaffRoleSlug;
  roleName: string;
};

export type LineupNoteItem = {
  id: string;
  title: string;
  body: string;
  shiftDate: string;
  shiftPeriod: "am" | "pm" | "all_day";
  priority: "low" | "normal" | "high" | "critical";
  createdAt: string;
  createdByName: string | null;
  acknowledgedByCurrentUser: boolean;
};

export type MenuUpdateItem = {
  id: string;
  headline: string;
  details: string | null;
  updateType: string;
  effectiveFrom: string;
  itemName: string;
  createdByName: string | null;
};

export type RecipeListItem = {
  id: string;
  name: string;
  station: string | null;
  prepTimeMinutes: number | null;
  ingredients: string;
  method: string;
  notes: string | null;
  menuItemName: string | null;
  createdAt: string;
};

export type TrainingModuleListItem = {
  id: string;
  title: string;
  description: string | null;
  estimatedMinutes: number | null;
  isFeatured: boolean;
  targetRoleName: string | null;
  targetRoleSlug: string | null;
  sectionCount: number;
};

export type CertificationStatusItem = {
  id: string;
  certificationName: string;
  status: "pending" | "completed" | "expired";
  completedAt: string | null;
  expiresAt: string | null;
};

export type ShiftOverview = {
  profile: HubProfile;
  lineupNotes: LineupNoteItem[];
  menuUpdates: MenuUpdateItem[];
  featuredTraining: TrainingModuleListItem[];
  certificationSummary: {
    completed: number;
    pending: number;
    expired: number;
  };
};
