"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, Save, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsViewProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Notifications", icon: Bell },
];

export function SettingsView({ user }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
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
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Profile Information
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Update your personal details.
              </p>

              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-xl hover:bg-slate-50"
                    >
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
                    defaultValue={user.name}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-700 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none text-sm text-slate-500 cursor-not-allowed font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Email cannot be changed directly.
                  </p>
                </div>

                <div className="pt-4">
                  <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl gap-2 shadow-lg shadow-indigo-100 transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-xs h-10 px-6">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Security Settings
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Manage your password and account security.
              </p>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>

                <div className="pt-4">
                  <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl gap-2 shadow-lg shadow-indigo-100 transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-xs h-10 px-6">
                    <Lock size={16} />
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                App Preferences
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Customize your experience.
              </p>

              <div className="space-y-6 max-w-lg">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
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
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                    <motion.div
                      layout
                      className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                      <Moon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Dark Mode
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Coming soon in v2.0
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
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
