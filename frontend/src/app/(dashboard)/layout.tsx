export const runtime = "nodejs";

import { Wrench } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMaintenanceMode } from "@/lib/server/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userRole = session.user.role || "USER";
  const maintenance = await getMaintenanceMode();

  return (
    <div className="flex h-screen w-full bg-[#f8faff] overflow-hidden antialiased">
      <Sidebar role={userRole} />
      <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 md:pt-20 lg:p-10 lg:pt-10 scrollbar-hide">
        {maintenance && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
          >
            <Wrench size={16} className="shrink-0" />
            {userRole === "ADMIN"
              ? "Maintenance mode is ON: only administrators can use the system. Turn it off from the Admin Panel."
              : "The system is under maintenance. Your data is safe and will be available again shortly."}
          </div>
        )}
        <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
