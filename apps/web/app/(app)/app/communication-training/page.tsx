import Link from "next/link";
import {
  CertificationStatusPanel,
  LineupFeed,
  MenuUpdatesPanel,
  ShiftOverviewCard,
  TrainingModuleList
} from "@/src/features/communication-training/components";
import {
  getHubProfile,
  getShiftOverview,
  getStaffCertificationStatuses,
  getTrainingModules
} from "@/src/features/communication-training/queries";

export default async function CommunicationTrainingHubPage() {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const [overview, certifications, modules] = await Promise.all([
    getShiftOverview(profile),
    getStaffCertificationStatuses(profile),
    getTrainingModules(profile)
  ]);

  return (
    <section className="ops-layout-grid">
      <ShiftOverviewCard overview={overview} />

      <div className="ops-quick-links">
        <Link href="/app/communication-training/lineup" className="ops-card-link">
          Open Lineup Feed
        </Link>
        <Link href="/app/communication-training/menu-updates" className="ops-card-link">
          Open Menu Updates
        </Link>
        <Link href="/app/communication-training/recipes" className="ops-card-link">
          Open Recipe Library
        </Link>
        <Link href="/app/communication-training/training" className="ops-card-link">
          Open Training Modules
        </Link>
      </div>

      <div className="ops-column-grid">
        <LineupFeed notes={overview.lineupNotes.slice(0, 2)} />
        <MenuUpdatesPanel updates={overview.menuUpdates.slice(0, 5)} />
      </div>

      <div className="ops-column-grid">
        <TrainingModuleList modules={modules.slice(0, 5)} />
        <CertificationStatusPanel items={certifications} currentRoleName={profile.roleName} />
      </div>
    </section>
  );
}
