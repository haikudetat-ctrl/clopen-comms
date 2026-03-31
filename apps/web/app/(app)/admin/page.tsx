import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/tenant";

function asPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export default async function AdminDashboardPage() {
  const tenant = await getTenantContext();
  const membership = tenant.activeMembership;

  if (!membership) {
    return (
      <section className="panel" style={{ display: "grid", gap: "0.5rem" }}>
        <h1>Manager Dashboard</h1>
        <p>No active location membership was found for your account.</p>
      </section>
    );
  }

  const supabase = await createSupabaseServerClient();
  const locationId = membership.location_id;

  const [activeStaffCountResult, pendingSignoffsResult, totalProgressResult, completedProgressResult, lineupBoardResult] =
    await Promise.all([
      supabase
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("location_id", locationId)
        .eq("status", "active")
        .eq("role", "staff"),
      supabase
        .from("trainer_signoffs")
        .select("id", { count: "exact", head: true })
        .eq("location_id", locationId)
        .eq("status", "pending"),
      supabase
        .from("user_module_progress")
        .select("id", { count: "exact", head: true })
        .eq("location_id", locationId),
      supabase
        .from("user_module_progress")
        .select("id", { count: "exact", head: true })
        .eq("location_id", locationId)
        .eq("completion_percent", 100),
      supabase
        .from("boards")
        .select("id, title")
        .eq("location_id", locationId)
        .eq("board_type", "lineup")
        .maybeSingle()
    ]);

  const activeStaffCount = activeStaffCountResult.count ?? 0;
  const pendingSignoffs = pendingSignoffsResult.count ?? 0;
  const totalProgressRows = totalProgressResult.count ?? 0;
  const completedProgressRows = completedProgressResult.count ?? 0;
  const onboardingCompletion =
    totalProgressRows > 0 ? (completedProgressRows / totalProgressRows) * 100 : 0;
  const lineupBoard = lineupBoardResult.data as { id: string; title: string } | null;

  let latestLineupTitle = "No published lineup yet";
  let lineupReadRate = 0;
  let acknowledgedCount = 0;

  if (lineupBoard?.id) {
    const latestPostResult = await supabase
      .from("posts")
      .select("id, title, created_at")
      .eq("board_id", lineupBoard.id)
      .eq("status", "published")
      .order("publish_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const latestPost = latestPostResult.data as { id: string; title: string; created_at: string } | null;

    if (latestPost) {
      latestLineupTitle = latestPost.title;
      const ackCountResult = await supabase
        .from("post_acknowledgements")
        .select("id", { count: "exact", head: true })
        .eq("post_id", latestPost.id);

      acknowledgedCount = ackCountResult.count ?? 0;
      lineupReadRate = activeStaffCount > 0 ? (acknowledgedCount / activeStaffCount) * 100 : 0;
    }
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.45rem" }}>
        <span className="pill">Location Snapshot</span>
        <h1>Manager Dashboard</h1>
        <p>Track completion, lineup acknowledgements, and content freshness before service.</p>
      </header>

      <div className="grid cols-3">
        <article className="panel">
          <h3>Onboarding Completion</h3>
          <p style={{ marginTop: "0.55rem" }}>
            {asPercent(onboardingCompletion)} completion across module progress records.
          </p>
        </article>
        <article className="panel">
          <h3>Pending Signoffs</h3>
          <p style={{ marginTop: "0.55rem" }}>{pendingSignoffs} trainer signoffs are pending review.</p>
        </article>
        <article className="panel">
          <h3>Lineup Read Rate</h3>
          <p style={{ marginTop: "0.55rem" }}>
            {asPercent(lineupReadRate)} acknowledged ({acknowledgedCount}/{activeStaffCount} staff).
          </p>
        </article>
      </div>

      <div className="grid cols-2">
        <article className="panel" style={{ display: "grid", gap: "0.55rem" }}>
          <h3>Open Actions</h3>
          <p>Publish today&apos;s lineup update if service notes changed.</p>
          <p>Review pending signoffs to close onboarding milestones.</p>
          <p>Audit incomplete module progress for staff coaching.</p>
        </article>

        <article className="panel" style={{ display: "grid", gap: "0.55rem" }}>
          <h3>Today at a Glance</h3>
          <p>Latest lineup: {latestLineupTitle}</p>
          <p>Active staff at this location: {activeStaffCount}</p>
          <p>Module progress rows tracked: {totalProgressRows}</p>
        </article>
      </div>
    </section>
  );
}
