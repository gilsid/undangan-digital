"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
const { data: session } = useSession();
const email = accountEmail ?? session?.user?.email;
  return (
    <aside className="w-64 shrink-0 bg-[var(--admin-brand)] text-white flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <p
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-xl"
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
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 space-y-3">
        {email && (
          <p className="text-xs text-white/50 truncate">{email}</p>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
