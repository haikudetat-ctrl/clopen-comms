import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/tenant";

export default async function StaffHomePage() {
  const tenant = await getTenantContext();
  const membership = tenant.activeMembership;
  const profile = tenant.profile;

  if (!membership || !profile) {
    return (
      <section className="panel" style={{ display: "grid", gap: "0.5rem" }}>
        <h1>Today&apos;s Preparation</h1>
        <p>No active location membership was found for your account.</p>
      </section>
    );
  }

  const supabase = await createSupabaseServerClient();
  const locationId = membership.location_id;
  const userId = profile.user_id;

  const [moduleProgressResult, activeStaffCountResult, lineupBoardResult] = await Promise.all([
    supabase
      .from("user_module_progress")
      .select("completion_percent, completed_at")
      .eq("location_id", locationId)
      .eq("user_id", userId),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("location_id", locationId)
      .eq("status", "active")
      .eq("role", "staff"),
    supabase
      .from("boards")
      .select("id")
      .eq("location_id", locationId)
      .eq("board_type", "lineup")
      .maybeSingle()
  ]);

  const moduleProgress = (moduleProgressResult.data ?? []) as {
    completion_percent: number;
    completed_at: string | null;
  }[];
  const completedModules = moduleProgress.filter((row) => row.completed_at).length;
  const averageCompletion =
    moduleProgress.length > 0
      ? Math.round(
          moduleProgress.reduce((sum, row) => sum + (row.completion_percent ?? 0), 0) / moduleProgress.length
        )
      : 0;

  const lineupBoard = lineupBoardResult.data as { id: string } | null;
  let lineupSummary = "No lineup has been published yet.";

  if (lineupBoard?.id) {
    const latestPostResult = await supabase
      .from("posts")
      .select("id, title")
      .eq("board_id", lineupBoard.id)
      .eq("status", "published")
      .order("publish_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const latestPost = latestPostResult.data as { id: string; title: string } | null;

    if (latestPost) {
      const ackResult = await supabase
        .from("post_acknowledgements")
        .select("id")
        .eq("post_id", latestPost.id)
        .eq("user_id", userId)
        .maybeSingle();

      lineupSummary = ackResult.data
        ? `You acknowledged: ${latestPost.title}`
        : `Pending acknowledgement: ${latestPost.title}`;
    }
  }

  const activeStaffCount = activeStaffCountResult.count ?? 0;

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.4rem" }}>
        <span className="pill">Welcome Back</span>
        <h1>Today&apos;s Preparation</h1>
        <p>Review lineup, complete assignments, and confirm your training progress.</p>
      </header>

      <div className="grid cols-3">
        <article className="panel">
          <h3>Due Today</h3>
          <p style={{ marginTop: "0.5rem" }}>
            {moduleProgress.length} tracked modules, {completedModules} completed.
          </p>
        </article>
        <article className="panel">
          <h3>Training Progress</h3>
          <p style={{ marginTop: "0.5rem" }}>Average module completion: {averageCompletion}%.</p>
        </article>
        <article className="panel">
          <h3>Lineup</h3>
          <p style={{ marginTop: "0.5rem" }}>{lineupSummary}</p>
        </article>
      </div>

      <article className="panel" style={{ display: "grid", gap: "0.45rem" }}>
        <h3>Location Team</h3>
        <p>{activeStaffCount} active staff members currently assigned to this location.</p>
      </article>
    </section>
  );
}
