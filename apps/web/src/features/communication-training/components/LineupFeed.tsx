import { acknowledgeLineupNoteAction } from "@/src/features/communication-training/actions/hub-actions";
import type { LineupNoteItem } from "@/src/features/communication-training/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function priorityLabel(priority: LineupNoteItem["priority"]): string {
  if (priority === "critical") return "Critical";
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Normal";
}

export function LineupFeed({ notes }: { notes: LineupNoteItem[] }) {
  if (notes.length === 0) {
    return (
      <section className="ops-card">
        <h2 className="ops-section-title">Lineup Notes</h2>
        <p className="ops-muted">No lineup notes have been posted for this shift yet.</p>
      </section>
    );
  }

  return (
    <section className="ops-card">
      <h2 className="ops-section-title">Lineup Notes</h2>
      <div className="ops-stack">
        {notes.map((note) => (
          <article key={note.id} className="ops-feed-item">
            <div className="ops-header-row">
              <div>
                <h3 className="ops-item-title">{note.title}</h3>
                <p className="ops-muted">
                  {priorityLabel(note.priority)} priority · {formatDate(note.createdAt)}
                </p>
              </div>
              <span className={`ops-pill ${note.acknowledgedByCurrentUser ? "is-complete" : "is-pending"}`}>
                {note.acknowledgedByCurrentUser ? "Acknowledged" : "Pending"}
              </span>
            </div>

            <p className="ops-body-copy">{note.body}</p>
            <p className="ops-muted">Published by {note.createdByName ?? "Manager"}</p>

            {!note.acknowledgedByCurrentUser ? (
              <form action={acknowledgeLineupNoteAction}>
                <input type="hidden" name="lineup_note_id" value={note.id} />
                <button type="submit" className="ops-button">
                  Acknowledge Note
                </button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
