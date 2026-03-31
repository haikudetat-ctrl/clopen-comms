import type { ShiftOverview } from "@/src/features/communication-training/types";

function prettyDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function ShiftOverviewCard({ overview }: { overview: ShiftOverview }) {
  const latestLineup = overview.lineupNotes[0] ?? null;
  const latestMenuUpdate = overview.menuUpdates[0] ?? null;

  return (
    <section className="ops-card ops-card-highlight">
      <div className="ops-header-row">
        <div>
          <p className="ops-kicker">Today&apos;s Shift</p>
          <h1 className="ops-title">Operational Readiness</h1>
        </div>
        <span className="ops-badge">{overview.profile.roleName}</span>
      </div>

      <div className="ops-metrics-grid">
        <article className="ops-metric">
          <p className="ops-metric-label">Lineup Notes</p>
          <p className="ops-metric-value">{overview.lineupNotes.length}</p>
          <p className="ops-metric-subtext">
            {latestLineup ? `Latest: ${latestLineup.title}` : "No notes published for today."}
          </p>
        </article>

        <article className="ops-metric">
          <p className="ops-metric-label">Menu Updates</p>
          <p className="ops-metric-value">{overview.menuUpdates.length}</p>
          <p className="ops-metric-subtext">
            {latestMenuUpdate
              ? `Latest: ${prettyDate(latestMenuUpdate.effectiveFrom)}`
              : "No active updates."}
          </p>
        </article>

        <article className="ops-metric">
          <p className="ops-metric-label">Featured Training</p>
          <p className="ops-metric-value">{overview.featuredTraining.length}</p>
          <p className="ops-metric-subtext">Priority modules for this shift window.</p>
        </article>

        <article className="ops-metric">
          <p className="ops-metric-label">Certifications</p>
          <p className="ops-metric-value">{overview.certificationSummary.completed}</p>
          <p className="ops-metric-subtext">
            {overview.certificationSummary.pending} pending, {overview.certificationSummary.expired} expired
          </p>
        </article>
      </div>
    </section>
  );
}
