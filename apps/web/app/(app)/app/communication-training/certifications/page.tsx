import { CertificationStatusPanel } from "@/src/features/communication-training/components";
import {
  getHubProfile,
  getStaffCertificationStatuses
} from "@/src/features/communication-training/queries";

export default async function CertificationsPage() {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const items = await getStaffCertificationStatuses(profile);

  return (
    <section className="ops-layout-grid">
      <CertificationStatusPanel items={items} currentRoleName={profile.roleName} />
    </section>
  );
}
