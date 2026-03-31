import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 920, margin: "0 auto" }}>
      <div className="panel" style={{ display: "grid", gap: "1rem" }}>
        <span className="pill">MVP Foundation</span>
        <h1>Clopen Hospitality Training Platform</h1>
        <p>
          Multi-tenant, white-label onboarding and knowledge platform for fine dining teams.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/login" className="button">
            Sign In
          </Link>
          <Link href="/app" className="button secondary">
            Open Shift Hub
          </Link>
          <Link href="/admin" className="button secondary">
            View Admin Shell
          </Link>
          <Link href="/staff" className="button secondary">
            View Staff Shell
          </Link>
        </div>
      </div>
    </main>
  );
}
