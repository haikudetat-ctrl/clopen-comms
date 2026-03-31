import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/tenant";
import { acknowledgeLineupPost } from "./actions";

function formatDate(value: string | null): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default async function StaffLineupPage() {
  const tenant = await getTenantContext();
  const membership = tenant.activeMembership;
  const profile = tenant.profile;

  if (!membership || !profile) {
    return (
      <section className="panel" style={{ display: "grid", gap: "0.5rem" }}>
        <h1>Pre-Shift Lineup</h1>
        <p>No active location membership was found for your account.</p>
      </section>
    );
  }

  const supabase = await createSupabaseServerClient();
  const locationId = membership.location_id;

  const lineupBoardResult = await supabase
    .from("boards")
    .select("id")
    .eq("location_id", locationId)
    .eq("board_type", "lineup")
    .maybeSingle();
  const lineupBoard = lineupBoardResult.data as { id: string } | null;

  if (!lineupBoard) {
    return (
      <section className="grid" style={{ gap: "1rem" }}>
        <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
          <h1>Pre-Shift Lineup</h1>
          <p>Read and acknowledge key updates before service starts.</p>
        </header>
        <article className="panel">
          <p>No lineup board exists for this location yet.</p>
        </article>
      </section>
    );
  }

  const latestPostResult = await supabase
    .from("posts")
    .select("id, title, body_markdown, publish_at, created_at")
    .eq("board_id", lineupBoard.id)
    .eq("status", "published")
    .order("publish_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const latestPost = latestPostResult.data as {
    id: string;
    title: string;
    body_markdown: string;
    publish_at: string | null;
    created_at: string;
  } | null;

  if (!latestPost) {
    return (
      <section className="grid" style={{ gap: "1rem" }}>
        <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
          <h1>Pre-Shift Lineup</h1>
          <p>Read and acknowledge key updates before service starts.</p>
        </header>
        <article className="panel">
          <p>No published lineup post is available yet.</p>
        </article>
      </section>
    );
  }

  const [ackResult, ackCountResult, activeStaffCountResult] = await Promise.all([
    supabase
      .from("post_acknowledgements")
      .select("id, acknowledged_at")
      .eq("post_id", latestPost.id)
      .eq("user_id", profile.user_id)
      .maybeSingle(),
    supabase
      .from("post_acknowledgements")
      .select("id", { count: "exact", head: true })
      .eq("post_id", latestPost.id),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("location_id", locationId)
      .eq("status", "active")
      .eq("role", "staff")
  ]);

  const ackCount = ackCountResult.count ?? 0;
  const activeStaffCount = activeStaffCountResult.count ?? 0;
  const readRate = activeStaffCount > 0 ? Math.round((ackCount / activeStaffCount) * 100) : 0;
  const hasAcknowledged = Boolean(ackResult.data);

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Pre-Shift Lineup</h1>
        <p>Read and acknowledge key updates before service starts.</p>
      </header>

      <article className="panel" style={{ display: "grid", gap: "0.65rem" }}>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <span className="pill">{hasAcknowledged ? "Acknowledged" : "Pending Acknowledgement"}</span>
          <h3>{latestPost.title}</h3>
          <p>Published: {formatDate(latestPost.publish_at ?? latestPost.created_at)}</p>
          <p>{latestPost.body_markdown}</p>
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <p>
            Team read rate: {readRate}% ({ackCount}/{activeStaffCount} staff acknowledgements)
          </p>
          {hasAcknowledged ? (
            <p>Your acknowledgement has been recorded.</p>
          ) : (
            <form action={acknowledgeLineupPost}>
              <input type="hidden" name="postId" value={latestPost.id} />
              <button className="button" type="submit">
                Mark as Acknowledged
              </button>
            </form>
          )}
        </div>
      </article>
    </section>
  );
}
