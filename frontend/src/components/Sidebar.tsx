"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  LogOut,
  Settings,
  Building2,
  ChevronRight,
  Activity,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Briefcase, label: "Projects", href: "/projects" },
    { icon: Users, label: "Team", href: "/users" },
    ...(isAdmin
      ? [
          { icon: ShieldCheck, label: "Admin Panel", href: "/admin" },
          { icon: Activity, label: "System Status", href: "/status" },
        ]
      : []),
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-16 border-b border-slate-200/60 bg-white/90 backdrop-blur-md z-60">
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 tracking-tight text-xs">
            MicroManager
          </span>
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="text-white" size={14} />
          </div>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-70 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-70 bg-white border-r border-slate-200 flex flex-col z-80 transition-transform duration-300 ease-in-out",
          "lg:sticky lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Building2 className="text-white" size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              MicroManager
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {isAdmin && (
          <div className="px-6 mb-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative flex items-center gap-3 px-4 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">
                    Security Level
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-700 truncate">
                      Administrator
                    </span>
                    <span className="shrink-0 flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((menuItem) => {
            const isActive = pathname === menuItem.href;
            return (
              <Link
                key={menuItem.href}
                href={menuItem.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <menuItem.icon
                    size={20}
                    className={cn(
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />
                  <span className="font-bold text-sm tracking-tight">
                    {menuItem.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight size={16} className="text-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-500 font-bold text-sm rounded-2xl hover:bg-rose-50 transition-all active:scale-[0.98]"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
