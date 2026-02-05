import { getUsers } from "@/lib/user.service";
import { UsersTable } from "@/components/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { auth } from "@/auth";
import { PageContainer } from "@/components/PageContainer";

export default async function UsersPage() {
  const users = await getUsers();
  const session = await auth();

  const userRole = (session?.user as { role?: string })?.role || "USER";

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1f36]">
            Team Members
          </h1>
          <p className="text-[12px] text-slate-400 font-medium">
            Manage user access and permissions.
          </p>
        </div>

        {userRole === "ADMIN" && (
          <Button className="bg-[#6366f1] hover:bg-indigo-600 text-white rounded-xl gap-2 shadow-lg shadow-indigo-100 transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-xs h-10 px-5">
            <UserPlus size={16} />
            Add Member
          </Button>
        )}
      </div>

      <UsersTable initialUsers={users} currentUserRole={userRole} />
    </PageContainer>
  );
}
