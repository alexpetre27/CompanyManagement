import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
