import { AppShell } from "@/components/app-shell";
import { getTenantContext } from "@/lib/tenant";
import { redirect } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/users", label: "Team" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/training", label: "Training" },
  { href: "/admin/communications", label: "Communications" }
];

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantContext();
  const role = tenant.activeMembership?.role ?? null;

  if (!tenant.profile) {
    redirect("/login");
  }

  if (!role || role === "staff") {
    redirect("/staff");
  }

  return (
    <AppShell
      title="Admin"
      subtitle="Configure locations, content, and staff learning operations"
      nav={adminNav}
      brandName={tenant.brand.brand_name}
    >
      {children}
    </AppShell>
  );
}
