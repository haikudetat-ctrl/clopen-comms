import Link from "next/link";
import { TrainingModuleList } from "@/src/features/communication-training/components";
import {
  getHubProfile,
  getRoleFilters,
  getTrainingModules
} from "@/src/features/communication-training/queries";

export default async function TrainingPage({
  searchParams
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const params = (await searchParams) ?? {};
  const selectedRole = params.role ?? "all";

  const [roles, modules] = await Promise.all([
    getRoleFilters(profile),
    getTrainingModules(profile, selectedRole)
  ]);

  return (
    <section className="ops-layout-grid">
      <section className="ops-card">
        <h2 className="ops-section-title">Browse by Role Target</h2>
        <p className="ops-muted">Filter modules by intended role for focused prep.</p>

        <div className="ops-chip-row">
          <Link
            href="/app/communication-training/training?role=all"
            className={`ops-chip ${selectedRole === "all" ? "is-active" : ""}`}
          >
            All Roles
          </Link>
          {roles.map((role) => (
            <Link
              key={role.slug}
              href={`/app/communication-training/training?role=${role.slug}`}
              className={`ops-chip ${selectedRole === role.slug ? "is-active" : ""}`}
            >
              {role.name}
            </Link>
          ))}
        </div>
      </section>

      <TrainingModuleList modules={modules} />
    </section>
  );
}
