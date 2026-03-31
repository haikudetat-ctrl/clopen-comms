export default function AdminLocationsPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Locations</h1>
        <p>Manage location profile, operating windows, and assignment scope.</p>
      </header>
      <div className="panel" style={{ display: "grid", gap: "0.6rem" }}>
        <h3>Atelier Midtown</h3>
        <p>Fine dining | New York, NY | 54 active staff members</p>
      </div>
    </section>
  );
}
