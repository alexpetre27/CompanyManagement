import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/Settings";
import { getCurrentUserServer } from "@/lib/server/data";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const apiUser = await getCurrentUserServer();

  const userData = {
    name: apiUser?.name || session.user.username || session.user.name || "User",
    email: apiUser?.email || session.user.email || "",
    role: apiUser?.role || session.user.role || "USER",
    avatar: apiUser?.avatar || session.user.image || null,
    notificationsEnabled: apiUser?.notificationsEnabled ?? true,
    themePreference: apiUser?.themePreference ?? "LIGHT",
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
