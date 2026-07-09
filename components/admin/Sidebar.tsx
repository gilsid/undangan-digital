"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
}

interface Props {
  navItems: SidebarNavItem[];
  activePath: string;
  accountEmail?: string;
}

export default function Sidebar({ navItems, activePath, accountEmail }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-[var(--ink-bg)] text-[var(--text-primary)] flex flex-col min-h-screen border-r border-[var(--foil-gold)]/40">
      <div className="px-6 py-6 border-b border-[var(--ink-border)]">
        <p
          className="text-xl text-[var(--foil-gold)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Undangan Digital
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--foil-gold)]/10 text-[var(--text-primary)] border-l-[3px] border-l-[var(--foil-gold)]"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--ink-border)] space-y-3">
        {accountEmail && (
          <p className="text-xs text-[var(--text-muted)] truncate">{accountEmail}</p>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
