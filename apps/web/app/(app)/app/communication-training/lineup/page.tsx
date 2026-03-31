import { createLineupNoteAction } from "@/src/features/communication-training/actions";
import { LineupFeed } from "@/src/features/communication-training/components";
import { getHubProfile, getLineupNotes } from "@/src/features/communication-training/queries";

function canManage(role: string): boolean {
  return role === "admin" || role === "operator" || role === "manager";
}

export default async function LineupPage() {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const notes = await getLineupNotes(profile);
  const managerAccess = canManage(profile.roleSlug);

  return (
    <section className="ops-layout-grid">
      <LineupFeed notes={notes} />

      {managerAccess ? (
        <section className="ops-card">
          <h2 className="ops-section-title">Publish Lineup Note</h2>
          <p className="ops-muted">Keep manager input lightweight for pre-shift speed.</p>

          <form action={createLineupNoteAction} className="ops-form-stack">
            <label className="ops-field">
              <span>Title</span>
              <input name="title" required placeholder="Dinner lineup: critical callouts" />
            </label>

            <div className="ops-form-row">
              <label className="ops-field">
                <span>Shift date</span>
                <input name="shift_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
              </label>

              <label className="ops-field">
                <span>Shift period</span>
                <select name="shift_period" defaultValue="pm">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                  <option value="all_day">All day</option>
                </select>
              </label>

              <label className="ops-field">
                <span>Priority</span>
                <select name="priority" defaultValue="normal">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
            </div>

            <label className="ops-field">
              <span>Body</span>
              <textarea
                name="body"
                required
                rows={5}
                placeholder="List service-critical changes first, then supporting details."
              />
            </label>

            <button type="submit" className="ops-button">
              Publish Note
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}
