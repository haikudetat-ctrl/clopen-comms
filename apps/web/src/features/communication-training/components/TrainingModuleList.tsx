import type { TrainingModuleListItem } from "@/src/features/communication-training/types";

export function TrainingModuleList({ modules }: { modules: TrainingModuleListItem[] }) {
  if (modules.length === 0) {
    return (
      <section className="ops-card">
        <h2 className="ops-section-title">Training Modules</h2>
        <p className="ops-muted">No modules match the selected role filter.</p>
      </section>
    );
  }

  return (
    <section className="ops-card">
      <h2 className="ops-section-title">Training Modules</h2>
      <div className="ops-stack">
        {modules.map((module) => (
          <article key={module.id} className="ops-feed-item">
            <div className="ops-header-row">
              <h3 className="ops-item-title">{module.title}</h3>
              <div className="ops-tag-row">
                {module.isFeatured ? <span className="ops-pill is-complete">Featured</span> : null}
                {module.targetRoleName ? <span className="ops-badge">{module.targetRoleName}</span> : null}
              </div>
            </div>
            {module.description ? <p className="ops-body-copy">{module.description}</p> : null}
            <p className="ops-muted">
              {module.estimatedMinutes ?? "--"} min · {module.sectionCount} section
              {module.sectionCount === 1 ? "" : "s"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
