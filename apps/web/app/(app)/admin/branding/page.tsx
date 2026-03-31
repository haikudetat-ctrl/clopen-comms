export default function AdminBrandingPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Brand Settings</h1>
        <p>Configure logos, typography, and color tokens by tenant scope.</p>
      </header>
      <div className="grid cols-2">
        <article className="panel" style={{ display: "grid", gap: "0.45rem" }}>
          <h3>Primary Color</h3>
          <p>#173A2A</p>
        </article>
        <article className="panel" style={{ display: "grid", gap: "0.45rem" }}>
          <h3>Accent Color</h3>
          <p>#A67C2B</p>
        </article>
      </div>
    </section>
  );
}
