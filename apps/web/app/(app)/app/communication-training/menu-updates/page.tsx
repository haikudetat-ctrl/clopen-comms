import { createMenuUpdateAction } from "@/src/features/communication-training/actions";
import { MenuUpdatesPanel } from "@/src/features/communication-training/components";
import {
  getHubProfile,
  getMenuItemsForLocation,
  getMenuUpdates
} from "@/src/features/communication-training/queries";

function canManage(role: string): boolean {
  return role === "admin" || role === "operator" || role === "manager";
}

export default async function MenuUpdatesPage() {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const [updates, menuItems] = await Promise.all([
    getMenuUpdates(profile),
    getMenuItemsForLocation(profile)
  ]);

  const managerAccess = canManage(profile.roleSlug);

  return (
    <section className="ops-layout-grid">
      <MenuUpdatesPanel updates={updates} />

      {managerAccess ? (
        <section className="ops-card">
          <h2 className="ops-section-title">Post Menu Update</h2>
          <p className="ops-muted">Updates are appended to history, never overwritten.</p>

          <form action={createMenuUpdateAction} className="ops-form-stack">
            <label className="ops-field">
              <span>Menu item</span>
              <select name="menu_item_id" required defaultValue="">
                <option value="" disabled>
                  Select an item
                </option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="ops-form-row">
              <label className="ops-field">
                <span>Update type</span>
                <select name="update_type" defaultValue="prep_change">
                  <option value="prep_change">Prep change</option>
                  <option value="allergy_alert">Allergy alert</option>
                  <option value="sold_out">Sold out</option>
                  <option value="added">Added</option>
                  <option value="removed">Removed</option>
                  <option value="price_change">Price change</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="ops-field">
                <span>Headline</span>
                <input name="headline" required placeholder="Hamachi now includes sesame finishing oil" />
              </label>
            </div>

            <label className="ops-field">
              <span>Details</span>
              <textarea
                name="details"
                rows={4}
                placeholder="Include what changed, when it applies, and how staff should respond."
              />
            </label>

            <button type="submit" className="ops-button">
              Publish Update
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}
