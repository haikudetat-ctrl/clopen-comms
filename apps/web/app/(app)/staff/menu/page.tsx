export default function StaffMenuPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Menu Knowledge</h1>
        <p>Study item details, allergens, and pairings before service.</p>
      </header>
      <div className="grid cols-2">
        <article className="panel" style={{ display: "grid", gap: "0.4rem" }}>
          <h3>Dry-Aged Duck Breast</h3>
          <p>Allergens: dairy | Pairing: Burgundy Pinot Noir</p>
        </article>
        <article className="panel" style={{ display: "grid", gap: "0.4rem" }}>
          <h3>Crudo of Hamachi</h3>
          <p>Allergens: fish, citrus | Pairing: Sancerre</p>
        </article>
      </div>
    </section>
  );
}
