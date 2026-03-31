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
  getStaffCertificationStatuses
} from "@/src/features/communication-training/queries";

export default async function AppDashboardPage() {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const [overview, certifications] = await Promise.all([
    getShiftOverview(profile),
    getStaffCertificationStatuses(profile)
  ]);

  return (
    <section className="ops-layout-grid">
      <ShiftOverviewCard overview={overview} />

      <div className="ops-column-grid">
        <LineupFeed notes={overview.lineupNotes} />
        <MenuUpdatesPanel updates={overview.menuUpdates} />
      </div>

      <div className="ops-column-grid">
        <TrainingModuleList modules={overview.featuredTraining} />
        <CertificationStatusPanel items={certifications} currentRoleName={profile.roleName} />
      </div>
    </section>
  );
}
