import type { MenuUpdateItem } from "@/src/features/communication-training/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatUpdateType(value: string): string {
  return value.replaceAll("_", " ");
}

export function MenuUpdatesPanel({ updates }: { updates: MenuUpdateItem[] }) {
  if (updates.length === 0) {
    return (
      <section className="ops-card">
        <h2 className="ops-section-title">Menu Updates</h2>
        <p className="ops-muted">No active menu updates for this location.</p>
      </section>
    );
  }

  return (
    <section className="ops-card">
      <h2 className="ops-section-title">Menu Updates</h2>
      <div className="ops-stack">
        {updates.map((update) => (
          <article key={update.id} className="ops-feed-item">
            <div className="ops-header-row">
              <h3 className="ops-item-title">{update.headline}</h3>
              <span className="ops-badge">{formatUpdateType(update.updateType)}</span>
            </div>
            <p className="ops-muted">{update.itemName}</p>
            {update.details ? <p className="ops-body-copy">{update.details}</p> : null}
            <p className="ops-muted">
              Effective {formatDate(update.effectiveFrom)} · Posted by {update.createdByName ?? "Manager"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
