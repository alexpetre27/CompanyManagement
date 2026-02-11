export const runtime = "nodejs";

import { Sidebar } from "@/components/Sidebar";
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
  if (!session) redirect("/login");
  const userRole = (session?.user as UserWithRole)?.role || "USER";

  return (
    <div className="flex h-screen w-full bg-[#f8faff] overflow-hidden antialiased">
      <Sidebar role={userRole} />
      <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 md:pt-20 lg:p-10 lg:pt-10 scrollbar-hide">
        <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
