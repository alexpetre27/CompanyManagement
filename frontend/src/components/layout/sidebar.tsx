"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proiecte", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Utilizatori", href: "/dashboard/users", icon: Users },
  { name: "Setări", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          C
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          Management
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={cn(
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-100"
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="font-medium">Deconectare</span>
        </button>
      </div>
    </aside>
  );
}
