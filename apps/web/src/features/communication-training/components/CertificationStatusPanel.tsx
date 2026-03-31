import type { CertificationStatusItem } from "@/src/features/communication-training/types";

function statusTone(status: CertificationStatusItem["status"]): string {
  if (status === "completed") return "is-complete";
  if (status === "expired") return "is-critical";
  return "is-pending";
}

function statusLabel(status: CertificationStatusItem["status"]): string {
  if (status === "completed") return "Completed";
  if (status === "expired") return "Expired";
  return "Pending";
}

function formatDate(value: string | null): string {
  if (!value) return "--";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function CertificationStatusPanel({
  items,
  currentRoleName
}: {
  items: CertificationStatusItem[];
  currentRoleName?: string;
}) {
  const completed = items.filter((item) => item.status === "completed").length;
  const pending = items.filter((item) => item.status === "pending").length;

  return (
    <section className="ops-card">
      <div className="ops-header-row">
        <div>
          <h2 className="ops-section-title">Certification Status</h2>
          <p className="ops-muted">Role target: {currentRoleName ?? "Staff"}</p>
        </div>
        <span className="ops-badge">
          {completed}/{items.length || 0} complete
        </span>
      </div>

      <p className="ops-muted">{pending} pending certifications require follow-through.</p>

      {items.length === 0 ? (
        <p className="ops-muted">No certifications assigned yet.</p>
      ) : (
        <div className="ops-stack">
          {items.map((item) => (
            <article key={item.id} className="ops-feed-item">
              <div className="ops-header-row">
                <h3 className="ops-item-title">{item.certificationName}</h3>
                <span className={`ops-pill ${statusTone(item.status)}`}>{statusLabel(item.status)}</span>
              </div>
              <p className="ops-muted">
                Completed: {formatDate(item.completedAt)} · Expires: {formatDate(item.expiresAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
