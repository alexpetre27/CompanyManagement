"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Briefcase, label: "Proiecte", href: "/projects" },
    { icon: Users, label: "Echipă", href: "/users" },

    ...(isAdmin
      ? [
          {
            icon: ShieldCheck,
            label: "Admin Panel",
            href: "/admin",
          },
          {
            icon: Activity,
            label: "System Status",
            href: "/status",
          },
        ]
      : []),

    { icon: Settings, label: "Setări", href: "/settings" },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Building2 className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          MicroManager
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={cn(
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span className="font-bold text-sm tracking-tight">
                  {item.label}
                </span>
              </div>
              {isActive && (
                <ChevronRight size={16} className="text-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        {isAdmin && (
          <div className="mb-4 px-4 py-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Session
            </p>
            <p className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              Administrator
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-bold text-sm rounded-2xl hover:bg-rose-50 transition group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          Logout
        </button>
      </div>
    </aside>
  );
}
