export const runtime = "nodejs";

import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-[#f8faff] overflow-hidden antialiased">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 scrollbar-hide">
        <div className="max-w-350 mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
