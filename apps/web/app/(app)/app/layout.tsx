import Link from "next/link";
import { redirect } from "next/navigation";
import { HubNav } from "@/src/features/communication-training/components";
import { getHubProfile } from "@/src/features/communication-training/queries";

export default async function ProtectedAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const profile = await getHubProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="ops-app">
      <header className="ops-topbar">
        <div>
          <p className="ops-kicker">Clopen</p>
          <h1 className="ops-topbar-title">Communication &amp; Training Hub</h1>
          <p className="ops-muted">
            {profile.fullName ?? "Team Member"} · {profile.roleName}
          </p>
        </div>
        <div className="ops-topbar-actions">
          <Link href="/staff" className="ops-ghost-link">
            Legacy Staff View
          </Link>
          <Link href="/admin" className="ops-ghost-link">
            Legacy Admin View
          </Link>
        </div>
      </header>

      <HubNav />

      <main className="ops-main">{children}</main>
    </div>
  );
}
