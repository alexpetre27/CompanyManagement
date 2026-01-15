"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // 1. Gestionăm montarea pe client pentru a evita erorile de hidratare
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Protecție: Dacă nu avem token, trimitem utilizatorul la login
  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [isMounted, token, router]);

  // Afișăm un loader discret până când verificăm starea de login
  if (!isMounted || !token) {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* SIDEBAR - Fix în partea stângă */}
      <Sidebar />

      {/* CONTAINER PRINCIPAL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER / TOPBAR MODERNA */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-400">Pagini</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold tracking-tight">
              Dashboard Overview
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right mr-2 hidden md:flex">
              <span className="text-sm font-bold text-slate-900 leading-none">
                {user?.username}
              </span>
              <span className="text-xs text-slate-500 mt-1">Administrator</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ZONA DE CONȚINUT - Singura zonă care are scroll */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
