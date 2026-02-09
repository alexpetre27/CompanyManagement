import { getUsersServer } from "@/types/data";
import { UsersTable } from "@/components/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { auth } from "@/auth";
import { PageContainer } from "@/components/PageContainer";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const users = await getUsersServer();

  const userRole = (session?.user as { role?: string })?.role || "USER";

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1a1f36] flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Users size={24} />
            </div>
            Team Members
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 ml-1">
            Manage user access, roles and platform permissions.
          </p>
        </div>

        {userRole === "ROLE_ADMIN" && (
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm font-bold h-10 px-6">
            <UserPlus size={18} className="mr-2" />
            Add Member
          </Button>
        )}
      </div>

      <UsersTable initialUsers={users} currentUserRole={userRole} />
    </PageContainer>
  );
}
