export default function StaffTrainingPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <header className="panel" style={{ display: "grid", gap: "0.35rem" }}>
        <h1>Training Plan</h1>
        <p>Structured onboarding and continuing education by module.</p>
      </header>
      <div className="panel" style={{ display: "grid", gap: "0.45rem" }}>
        <h3>New Hire Foundations</h3>
        <p>4/6 modules complete</p>
      </div>
      <div className="panel" style={{ display: "grid", gap: "0.45rem" }}>
        <h3>Spring Menu Knowledge</h3>
        <p>2/5 modules complete</p>
      </div>
    </section>
  );
}
