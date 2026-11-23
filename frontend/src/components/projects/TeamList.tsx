import Link from "next/link";
import type { ProjectMember } from "@/types/project";
import { Users } from "lucide-react";

export function TeamList({
  team,
  manageHref,
}: {
  team: ProjectMember[];
  manageHref?: string;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-[#1a1f36] flex items-center gap-2">
          <Users size={16} className="text-[#6366f1]" /> Team Members
        </h2>
        {manageHref && (
          <Link
            href={manageHref}
            className="text-xs text-[#6366f1] font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            Manage Team
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {team.length > 0 ? (
          team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                  {(member.name || "?").substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{member.role}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400">No members assigned.</p>
        )}
      </div>
    </>
  );
}
