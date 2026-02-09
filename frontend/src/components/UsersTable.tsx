"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  ArrowUp,
  ArrowDown,
  X,
  ShieldCheck,
  User as UserIcon,
  MoreHorizontal,
  ChevronDown,
  Trash2,
  Briefcase,
} from "lucide-react";
import { User, FilterDropdownProps, UsersTableProps } from "@/types/user";
import { ProjectResponse, FilterOption } from "@/types/project";
import { useDebounce } from "@/types/useDebounce";
import FilterDropdown from "./FilterDropdown";
type SortConfig = {
  key: keyof User;
  direction: "ascending" | "descending";
};

export function UsersTable({ initialUsers, currentUserRole }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [project, setProject] = useState("ALL");
  const [backendProjects, setBackendProjects] = useState<FilterOption[]>([]);
  const [sort, setSort] = useState<SortConfig>({
    key: "name",
    direction: "ascending",
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data: ProjectResponse[] = await response.json();
        const formatted: FilterOption[] = data.map((p) => ({
          label: p.name,
          value: p.id.toString(),
        }));
        setBackendProjects(formatted);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    fetchProjects();
  }, []);

  const users = useMemo(() => {
    let list = [...initialUsers];
    if (debouncedSearch) {
      const t = debouncedSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t),
      );
    }
    if (role !== "ALL") list = list.filter((u) => u.role === role);
    if (status !== "ALL")
      list = list.filter((u) => u.active === (status === "ACTIVE"));
    if (project !== "ALL") list = list.filter((u) => u.project === project);

    list.sort((a, b) => {
      const aVal = String(a[sort.key] ?? "");
      const bVal = String(b[sort.key] ?? "");
      return sort.direction === "ascending"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return list;
  }, [initialUsers, debouncedSearch, role, status, project, sort]);

  const handleSort = (key: keyof User) => {
    setSort((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const sortIcon = (key: keyof User) => {
    if (sort.key !== key)
      return (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-40" />
      );
    return sort.direction === "ascending" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-indigo-500" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-indigo-500" />
    );
  };

  const clearFilters = () => {
    setSearch("");
    setRole("ALL");
    setStatus("ALL");
    setProject("ALL");
  };

  const projectOptions = useMemo(
    (): FilterOption[] => [
      { label: "All", value: "ALL" },
      ...backendProjects.map((p) => ({ ...p, icon: <Briefcase size={12} /> })),
    ],
    [backendProjects],
  );

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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 border-slate-200/60 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <AnimatePresence>
            {(search ||
              role !== "ALL" ||
              status !== "ALL" ||
              project !== "ALL") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="h-10 w-10 text-slate-400 hover:text-red-500 rounded-xl"
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <FilterDropdown
            label="Project"
            value={project}
            onChange={setProject}
            options={projectOptions}
          />
          <FilterDropdown
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { label: "All", value: "ALL" },
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
          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "All", value: "ALL" },
              {
                label: "Active",
                value: "ACTIVE",
                icon: (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ),
              },
              {
                label: "Inactive",
                value: "INACTIVE",
                icon: (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="rounded-[22px] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              {["name", "email", "role", "active"].map((key) => (
                <TableHead
                  key={key}
                  onClick={() => handleSort(key as keyof User)}
                  className="h-12 cursor-pointer group text-[10px] font-bold uppercase tracking-widest text-slate-400 px-6"
                >
                  <div className="flex items-center">
                    {key === "active" ? "Status" : key}{" "}
                    {sortIcon(key as keyof User)}
                  </div>
                </TableHead>
              ))}
              {currentUserRole === "ADMIN" && (
                <TableHead className="h-12 w-10" />
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="popLayout">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="py-4 px-6 font-medium text-slate-700">
                    {user.name}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-500">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-100 text-slate-500 shadow-sm">
                      {user.role === "ROLE_ADMIN" ? (
                        <ShieldCheck size={10} className="text-indigo-500" />
                      ) : (
                        <UserIcon size={10} />
                      )}
                      {user.role.replace("ROLE_", "")}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.active ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span
                        className={`text-xs font-medium ${user.active ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  {currentUserRole === "ADMIN" && (
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
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search size={20} className="opacity-20" />
                    <p className="text-sm font-medium">No users found</p>
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="text-xs h-auto p-0"
                    >
                      Clear all
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
