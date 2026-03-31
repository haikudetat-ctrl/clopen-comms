export default function AdminTrainingPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Training Library</h1>
        <p>Create onboarding plans, modules, and signoff checkpoints.</p>
      </header>
      <div className="grid cols-3">
        <article className="panel">
          <h3>Programs</h3>
          <p style={{ marginTop: "0.45rem" }}>4 active programs</p>
        </article>
        <article className="panel">
          <h3>Modules</h3>
          <p style={{ marginTop: "0.45rem" }}>17 published modules</p>
        </article>
        <article className="panel">
          <h3>Activities</h3>
          <p style={{ marginTop: "0.45rem" }}>92 total learning activities</p>
        </article>
      </div>
    </section>
  );
}
