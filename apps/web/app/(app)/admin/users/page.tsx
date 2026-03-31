export default function AdminUsersPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Team and Permissions</h1>
        <p>Invite staff and assign location roles.</p>
      </header>
      <div className="panel" style={{ display: "grid", gap: "0.5rem" }}>
        <p><strong>Location Manager:</strong> 3</p>
        <p><strong>Trainer:</strong> 6</p>
        <p><strong>Staff:</strong> 45</p>
      </div>
    </section>
  );
}
