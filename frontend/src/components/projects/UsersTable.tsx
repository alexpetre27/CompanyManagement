"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ArrowUpDown,
  ShieldCheck,
  User as UserIcon,
  MoreHorizontal,
  Trash2,
  Briefcase,
  UserMinus,
  Loader2,
} from "lucide-react";
import { User, UsersTableProps } from "@/types/user";
import { ProjectResponse, FilterOption } from "@/types/project";
import { useDebounce } from "@/types/useDebounce";
import FilterDropdownPortal from "./FilterDropdownPortal";
import { toast } from "sonner";

type SortConfig = {
  key: keyof User;
  direction: "ascending" | "descending";
};

export function UsersTable({ initialUsers, currentUserRole }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [role, setRole] = useState("ALL");
  const [project, setProject] = useState("ALL");
  const [backendProjects, setBackendProjects] = useState<FilterOption[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [sort, setSort] = useState<SortConfig>({
    key: "name",
    direction: "ascending",
  });

  const isAdmin =
    currentUserRole === "ADMIN" || currentUserRole === "ROLE_ADMIN";

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/microservices`,
        );
        const data: ProjectResponse[] = await response.json();
        const formatted: FilterOption[] = data.map((p) => ({
          label: p.name,
          value: p.id.toString(),
        }));
        setBackendProjects(formatted);
      } catch (error) {
        console.error("Failed to fetch projects for filters", error);
      }
    }
    fetchProjects();
  }, []);

  const handleUnassign = async (userId: number) => {
    setLoadingId(userId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/unassign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) throw new Error();
      toast.success("User removed from project");
      router.refresh();
    } catch {
      toast.error("Failed to unassign user");
    } finally {
      setLoadingId(null);
    }
  };

  const users = useMemo(() => {
    let list = initialUsers.filter((u) => u.project && u.project !== "0");

    if (debouncedSearch) {
      const t = debouncedSearch.toLowerCase();
      list = list.filter(
        (u) =>
          (u.name?.toLowerCase() || "").includes(t) ||
          (u.email?.toLowerCase() || "").includes(t),
      );
    }

    if (role !== "ALL") list = list.filter((u) => u.role === role);
    if (project !== "ALL") list = list.filter((u) => u.project === project);

    list.sort((a, b) => {
      const aVal = String(a[sort.key] ?? "");
      const bVal = String(b[sort.key] ?? "");
      return sort.direction === "ascending"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return list;
  }, [initialUsers, debouncedSearch, role, project, sort]);

  const handleSort = (key: keyof User) => {
    setSort((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setRole("ALL");
    setProject("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-72 group">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            />
            <Input
              placeholder="Search active members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 border-slate-200/60 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
            />
          </div>
          {(search || role !== "ALL" || project !== "ALL") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="h-10 w-10 text-slate-400 hover:text-red-500 rounded-xl"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <FilterDropdownPortal
            label="Project"
            value={project}
            onChange={setProject}
            options={[
              { label: "All Projects", value: "ALL" },
              ...backendProjects,
            ]}
          />
          <FilterDropdownPortal
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { label: "All Roles", value: "ALL" },
              {
                label: "Admin",
                value: "ROLE_ADMIN",
                icon: <ShieldCheck size={12} />,
              },
              {
                label: "User",
                value: "ROLE_USER",
                icon: <UserIcon size={12} />,
              },
            ]}
          />
        </div>
      </div>

      <div className="rounded-[22px] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              {["name", "email", "role", "project"].map((key) => (
                <TableHead
                  key={key}
                  onClick={() => handleSort(key as keyof User)}
                  className="h-12 cursor-pointer group text-[10px] font-bold uppercase tracking-widest text-slate-400 px-6"
                >
                  <div className="flex items-center gap-1">
                    {key === "project" ? "Assigned Project" : key}
                    <ArrowUpDown
                      size={12}
                      className={`transition-opacity ${sort.key === key ? "opacity-100 text-indigo-500" : "opacity-20 group-hover:opacity-50"}`}
                    />
                  </div>
                </TableHead>
              ))}
              {isAdmin && <TableHead className="px-6 text-right w-16" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                      </div>
                      <span className="font-bold text-slate-700">
                        {user.name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-500 text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-100 text-slate-500 shadow-sm">
                      {user.role?.includes("ADMIN") ? (
                        <ShieldCheck size={10} className="text-indigo-500" />
                      ) : (
                        <UserIcon size={10} />
                      )}
                      {(user.role || "USER").replace("ROLE_", "")}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                      <Briefcase size={12} className="opacity-60" />
                      {user.project}
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg"
                          >
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl w-48 shadow-2xl border-slate-100"
                        >
                          <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 text-xs font-bold cursor-pointer"
                            onClick={() => handleUnassign(user.id)}
                            disabled={loadingId === user.id}
                          >
                            {loadingId === user.id ? (
                              <Loader2
                                size={12}
                                className="animate-spin mr-2"
                              />
                            ) : (
                              <UserMinus size={12} className="mr-2" />
                            )}
                            Remove from Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {users.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-200 mb-4">
              <Search size={24} />
            </div>
            <p className="text-sm font-bold text-slate-400">
              No active members found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
