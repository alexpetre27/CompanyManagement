"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ProjectSelectorPortal } from "@/components/projects/ProjectSelectorPortal";
import { assignUserAction } from "@/lib/actions/user";
import type { ProjectRole, User } from "@/types/user";
import type { Project } from "@/types/project";

interface SelectionData {
  projectId: string;
  projectRole: ProjectRole;
}

type SelectionState = Record<number, SelectionData>;

interface UnassignedUsersListProps {
  users: User[];
  projects: Project[];
}

interface UserRowProps {
  user: User;
  projects: Project[];
  loading: boolean;
  selection?: SelectionData;
  onSelect: (userId: number, data: Partial<SelectionData>) => void;
  onAssign: (userId: number) => void;
}

const PROJECT_ROLES: { value: ProjectRole; label: string }[] = [
  { value: "DEVELOPER", label: "Developer" },
  { value: "MANAGER", label: "Manager" },
  { value: "DESIGNER", label: "Designer" },
];

export function UnassignedUsersList({ users, projects }: UnassignedUsersListProps) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const [selections, setSelections] = useState<SelectionState>({});

  const unassignedUsers = useMemo(
    () => users.filter((u) => u.role !== "ADMIN" && u.projectId == null),
    [users],
  );

  const updateSelection = useCallback((userId: number, data: Partial<SelectionData>) => {
    setSelections((prev) => ({
      ...prev,
      [userId]: {
        projectId: prev[userId]?.projectId || "",
        projectRole: prev[userId]?.projectRole || "DEVELOPER",
        ...data,
      },
    }));
  }, []);

  const assignOne = useCallback(
    async (userId: number): Promise<boolean> => {
      const selection = selections[userId];
      if (!selection?.projectId) {
        toast.error("Select a project first");
        return false;
      }

      setLoadingIds((prev) => new Set(prev).add(userId));
      const result = await assignUserAction(userId, Number(selection.projectId), selection.projectRole);
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });

      if (!result.success) {
        toast.error(result.message);
        return false;
      }
      return true;
    },
    [selections],
  );

  const handleAssign = useCallback(
    async (userId: number) => {
      if (await assignOne(userId)) {
        toast.success("User assigned");
        router.refresh();
      }
    },
    [assignOne, router],
  );

  const assignAll = useCallback(async () => {
    const ready = unassignedUsers.filter((u) => selections[u.id]?.projectId);
    if (!ready.length) {
      toast.error("No users have a project selected");
      return;
    }
    const results = await Promise.all(ready.map((u) => assignOne(u.id)));
    const successCount = results.filter(Boolean).length;
    if (successCount > 0) {
      toast.success(`${successCount} user(s) assigned`);
      router.refresh();
    }
  }, [unassignedUsers, selections, assignOne, router]);

  return (
    <Card className="mb-8 border border-indigo-100 rounded-[24px] bg-white shadow-lg overflow-hidden">
      <div className="bg-indigo-50/60 p-6 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <UserPlus size={20} />
          </div>
          <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tight">
            Pending Assignments
          </h3>
        </div>

        {unassignedUsers.length > 0 && (
          <Button
            onClick={assignAll}
            disabled={loadingIds.size > 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6"
          >
            {loadingIds.size > 0 ? <Loader2 className="animate-spin" /> : "Assign All"}
          </Button>
        )}
      </div>

      <div className="divide-y divide-indigo-50">
        {unassignedUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold">
            All team members are assigned.
          </div>
        ) : (
          unassignedUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              projects={projects}
              loading={loadingIds.has(user.id)}
              selection={selections[user.id]}
              onSelect={updateSelection}
              onAssign={handleAssign}
            />
          ))
        )}
      </div>
    </Card>
  );
}

function UserRow({ user, projects, loading, selection, onSelect, onAssign }: UserRowProps) {
  return (
    <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4 min-w-60">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
          {(user.name || "U").slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 truncate">{user.name || "Unknown User"}</p>
          <p className="text-xs font-semibold text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProjectSelectorPortal
          projects={projects}
          selectedId={selection?.projectId || ""}
          onSelect={(id) => onSelect(user.id, { projectId: id })}
          themeRing="focus:ring-indigo-200"
        />
        <div className="relative">
          <select
            value={selection?.projectRole || "DEVELOPER"}
            onChange={(e) => onSelect(user.id, { projectRole: e.target.value as ProjectRole })}
            aria-label="Project role"
            className="w-full h-11 rounded-xl border border-slate-200 px-4 font-bold text-sm text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white appearance-none transition-all"
          >
            {PROJECT_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ShieldCheck
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          />
        </div>
      </div>

      <Button
        onClick={() => onAssign(user.id)}
        disabled={loading || !selection?.projectId}
        className="lg:w-32 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-11"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Assign"}
      </Button>
    </div>
  );
}
