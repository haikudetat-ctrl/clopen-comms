"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Today" },
  { href: "/app/communication-training", label: "Hub" },
  { href: "/app/communication-training/lineup", label: "Lineup" },
  { href: "/app/communication-training/menu-updates", label: "Menu" },
  { href: "/app/communication-training/recipes", label: "Recipes" },
  { href: "/app/communication-training/training", label: "Training" },
  { href: "/app/communication-training/certifications", label: "Certs" }
];

export function HubNav() {
  const pathname = usePathname();

  return (
    <nav className="ops-tabs" aria-label="Communication and training navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={`ops-tab ${isActive ? "is-active" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
