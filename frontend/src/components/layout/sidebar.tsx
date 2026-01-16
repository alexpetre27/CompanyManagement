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
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Briefcase, label: "Proiecte", href: "/projects" },
  { icon: Users, label: "Echipă", href: "/users" },
  { icon: Settings, label: "Setări", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Building2 className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          CoreAdmin
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
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
                    "transition-colors",
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

      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-[2rem] p-6 mb-4 relative overflow-hidden">
          <p className="text-white text-xs font-bold mb-1 opacity-80 uppercase tracking-widest">
            Plan Curent
          </p>
          <p className="text-white font-bold text-lg mb-4 italic">Enterprise</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-3/4 rounded-full" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-rose-500 font-bold text-sm rounded-2xl hover:bg-rose-50 transition-colors group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          Deconectare
        </button>
      </div>
    </aside>
  );
}
