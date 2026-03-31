import { AppShell } from "@/components/app-shell";
import { getTenantContext } from "@/lib/tenant";
import { redirect } from "next/navigation";

const staffNav = [
  { href: "/staff", label: "Home" },
  { href: "/staff/training", label: "Training" },
  { href: "/staff/menu", label: "Menu Knowledge" },
  { href: "/staff/lineup", label: "Lineup" }
];

export default async function StaffLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantContext();

  if (!tenant.profile) {
    redirect("/login");
  }

  return (
    <AppShell
      title="Staff"
      subtitle="Stay aligned before service with concise daily preparation"
      nav={staffNav}
      brandName={tenant.brand.brand_name}
    >
      {children}
    </AppShell>
  );
}
