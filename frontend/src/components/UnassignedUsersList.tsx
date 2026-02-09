"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";
import { ProjectSelectorPortal } from "@/components/ProjectSelectorPortal";
import FilterDropdownPortal from "@/components/FilterDropdownPortal";
import { User } from "@/types/user";
import { Project } from "@/types/project";

export function UnassignedUsersList({
  users,
  projects,
}: {
  users: User[];
  projects: Project[];
}) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [selections, setSelections] = useState<
    Record<number, { projectId: string; role: string }>
  >({});

  const unassignedUsers = users.filter((u) => {
    const role = u.role || "";
    if (role.includes("ADMIN")) return false;
    return !u.project || u.project === "0";
  });

  const handleAssign = async (userId: number) => {
    const selection = selections[userId];
    if (!selection?.projectId) return toast.error("Select a project");

    setLoadingIds((prev) => [...prev, userId]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/assign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: selection.projectId,
            role: selection.role || "ROLE_USER",
          }),
        },
      );
      if (!res.ok) throw new Error();
      toast.success("Assigned successfully");
      router.refresh();
    } catch {
      toast.error("Assignment failed");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  if (unassignedUsers.length === 0) return null;

  return (
    <Card className="mb-8 border-2 border-indigo-100 rounded-[24px] overflow-visible">
      <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 rounded-t-[24px] flex items-center gap-4">
        <UserPlus className="text-indigo-600" />
        <h3 className="text-lg font-black text-indigo-900">
          Pending Assignments
        </h3>
      </div>
      <div className="divide-y divide-indigo-50">
        {unassignedUsers.map((user) => (
          <div
            key={user.id}
            className="p-6 flex flex-col xl:flex-row gap-6 items-center"
          >
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                {user.name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <span className="font-bold text-slate-700">{user.name}</span>
            </div>

            <div className="flex flex-1 gap-4 w-full">
              <ProjectSelectorPortal
                projects={projects}
                selectedId={selections[user.id]?.projectId || ""}
                onSelect={(id) =>
                  setSelections((prev) => ({
                    ...prev,
                    [user.id]: { ...(prev[user.id] || {}), projectId: id },
                  }))
                }
                themeRing={""}
              />

              <FilterDropdownPortal
                label="Role"
                value={selections[user.id]?.role || "ROLE_USER"}
                onChange={(val) =>
                  setSelections((prev) => ({
                    ...prev,
                    [user.id]: { ...(prev[user.id] || {}), role: val },
                  }))
                }
                options={[
                  { label: "Developer", value: "ROLE_USER" },
                  {
                    label: "Manager",
                    value: "ROLE_MANAGER",
                    icon: <Shield size={12} />,
                  },
                ]}
              />
            </div>

            <Button
              onClick={() => handleAssign(user.id)}
              disabled={loadingIds.includes(user.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold"
            >
              {loadingIds.includes(user.id) ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
