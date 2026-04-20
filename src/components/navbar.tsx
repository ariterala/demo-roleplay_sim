"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="text-primary">Pitch</span>
          <span>Lab</span>
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
