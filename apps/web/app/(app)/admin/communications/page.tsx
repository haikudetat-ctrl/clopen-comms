export default function AdminCommunicationsPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Communication Boards</h1>
        <p>Publish pre-shift lineup, menu updates, and operations notices.</p>
      </header>
      <div className="grid cols-2">
        <article className="panel" style={{ display: "grid", gap: "0.45rem" }}>
          <h3>Latest Lineup</h3>
          <p>Tonight: spring tasting focus, two VIP allergies, cellar spotlight.</p>
        </article>
        <article className="panel" style={{ display: "grid", gap: "0.45rem" }}>
          <h3>Read Acknowledgements</h3>
          <p>38/42 staff acknowledged before 3:30 PM.</p>
        </article>
      </div>
    </section>
  );
}
