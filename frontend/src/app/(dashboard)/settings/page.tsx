import { auth } from "@/auth";
import { SettingsView } from "@/components/Settings";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userData = {
    name: session.user.name || "User",
    email: session.user.email || "",
    role: ((session.user as Record<string, unknown>).role as string) || "USER",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="pt-2">
        <h1 className="text-xl font-extrabold text-[#1a1f36]">
          Account Settings
        </h1>
        <p className="text-[12px] text-slate-400 font-medium">
          Manage your profile and security preferences.
        </p>
      </div>

      <SettingsView user={userData} />
    </div>
  );
}
