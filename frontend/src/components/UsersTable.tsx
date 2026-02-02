"use client";

import { useState } from "react";
import { User } from "@/types/user";
import {
  Search,
  MoreVertical,
  Trash2,
  UserCheck,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UsersTableProps {
  initialUsers: User[];
  currentUserRole?: string;
}

export function UsersTable({ initialUsers, currentUserRole }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {getInitials(user.username)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">
                          {user.username}
                        </p>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Mail size={10} />
                          <p className="text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-slate-400" />
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${user.role === "ADMIN" ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-slate-600">
                        Active
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currentUserRole === "ADMIN" && (
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
                        >
                          <UserCheck size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-slate-900 active:scale-95 transition-all"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                      <UserIcon size={24} className="opacity-20" />
                    </div>
                    <p className="font-bold text-slate-600 text-sm">
                      No users found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
