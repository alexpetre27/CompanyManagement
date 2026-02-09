export const runtime = "nodejs";

import { Sidebar } from "@/components/Sidebar"; // Asigură-te că importul e corect
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface UserWithRole {
  role?: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // 1. EXTRAGEM ROLUL DIN SESIUNE
  // Fallback pe "USER" dacă nu există rol.
  const userRole = (session?.user as UserWithRole)?.role || "USER";

  return (
    <div className="flex h-screen w-full bg-[#f8faff] overflow-hidden antialiased">
      <Sidebar role={userRole} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
