"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, Save, Moon, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  updateUserProfile,
  uploadUserAvatar,
  changeUserPassword,
  updateUserPreferences,
} from "@/lib/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsViewProps } from "@/types/user";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Preferences", icon: Bell },
];

export function SettingsView({ user }: SettingsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    username: user.name,
    email: user.email,
  });

  const getInitialAvatarUrl = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:8080";
    return `${baseUrl}${path}`;
  };

  const [avatarUrl, setAvatarUrl] = useState(getInitialAvatarUrl(user.avatar));

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [preferences, setPreferences] = useState({
    notificationsEnabled: user.notificationsEnabled ?? true,
    themePreference: user.themePreference || "LIGHT",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);
    setLoading(true);

    try {
      const response = await uploadUserAvatar(file);
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:8080";
      setAvatarUrl(`${backendUrl}${response.avatar}`);
      toast.success("Avatar updated successfully!");
      router.refresh();
    } catch (_error) {
      toast.error("Failed to upload avatar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile(profileData);
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (_error) {
      toast.error("Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passData.currentPassword || !passData.newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    setLoading(true);
    try {
      await changeUserPassword({
        oldPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = async (
    key: "notificationsEnabled" | "themePreference",
  ) => {
    let newValue: boolean | string;
    if (key === "notificationsEnabled") {
      newValue = !preferences.notificationsEnabled;
    } else {
      newValue = preferences.themePreference === "LIGHT" ? "DARK" : "LIGHT";
    }

    setPreferences((prev) => ({ ...prev, [key]: newValue }));

    try {
      await updateUserPreferences({ [key]: newValue });
    } catch (_error) {
      toast.error("Failed to save preference.");
      setPreferences((prev) => ({
        ...prev,
        [key]:
          key === "notificationsEnabled"
            ? !newValue
            : newValue === "LIGHT"
              ? "DARK"
              : "LIGHT",
      }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-64 shrink-0 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-[#6366f1] rounded-xl shadow-md shadow-indigo-200"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-3">
              <tab.icon size={18} />
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Profile Information
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Update your personal details.
              </p>

              <div className="space-y-6 max-w-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 rounded-2xl border-2 border-indigo-50 shadow-sm">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xl rounded-2xl">
                      {profileData.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs rounded-xl gap-2"
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-[#6366f1] hover:bg-indigo-600 text-white rounded-xl gap-2 font-bold text-xs h-10 px-6 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Security Settings
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Manage your password.
              </p>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="bg-[#6366f1] hover:bg-indigo-600 text-white rounded-xl gap-2 font-bold   text-xs h-10 px-6 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Lock size={16} />
                    )}
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                App Preferences
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Customize your experience.
              </p>

              <div className="space-y-6 max-w-lg">
                <div
                  onClick={() => handleTogglePreference("notificationsEnabled")}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                    preferences.notificationsEnabled
                      ? "border-indigo-200 bg-indigo-50/50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${preferences.notificationsEnabled ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Email Notifications
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Receive weekly summaries.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${preferences.notificationsEnabled ? "bg-indigo-600" : "bg-slate-300"}`}
                  >
                    <motion.div
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                      animate={{
                        left: preferences.notificationsEnabled ? "24px" : "4px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() => handleTogglePreference("themePreference")}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                    preferences.themePreference === "DARK"
                      ? "border-indigo-200 bg-indigo-50/50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${preferences.themePreference === "DARK" ? "bg-indigo-900 text-indigo-100" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Moon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Dark Mode
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {preferences.themePreference === "DARK"
                          ? "Enabled"
                          : "Disabled"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${preferences.themePreference === "DARK" ? "bg-indigo-900" : "bg-slate-300"}`}
                  >
                    <motion.div
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                      animate={{
                        left:
                          preferences.themePreference === "DARK"
                            ? "24px"
                            : "4px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
