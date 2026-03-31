import { ShellNav, type NavItem } from "@/components/shell-nav";

export function AppShell({
  title,
  subtitle,
  nav,
  brandName,
  children
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  brandName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div style={{ marginBottom: "1.25rem" }}>
          <span className="pill">{brandName}</span>
          <h2 style={{ marginTop: "0.6rem" }}>{title}</h2>
          <p style={{ marginTop: "0.35rem" }}>{subtitle}</p>
        </div>
        <ShellNav items={nav} />
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
