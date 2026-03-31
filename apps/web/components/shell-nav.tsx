"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  label: string;
};

export function ShellNav({
  items
}: {
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-link ${pathname === item.href ? "active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
