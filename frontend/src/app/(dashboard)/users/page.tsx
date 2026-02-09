import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { getUsersServer, getProjectsServer } from "@/types/data";
import { UsersTable } from "@/components/UsersTable";
import { UnassignedUsersList } from "@/components/UnassignedUsersList";
import { Users } from "lucide-react";

interface SessionUser {
  role?: string;
}

export default async function TeamPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [users, projects] = await Promise.all([
    getUsersServer(),
    getProjectsServer(),
  ]);

  const user = session.user as SessionUser;
  const userRole = user.role || "USER";

  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  return (
    <PageContainer className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1a1f36] flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Users size={24} />
            </div>
            Team Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 ml-1">
            Oversee team members, assignments, and roles.
          </p>
        </div>
      </div>

      {isAdmin && <UnassignedUsersList users={users} projects={projects} />}

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            All Members
          </h3>
        </div>
        <UsersTable initialUsers={users} currentUserRole={userRole} />
      </div>
    </PageContainer>
  );
}
