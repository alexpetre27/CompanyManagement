"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
  const auth = useAuthStore();
  const router = useRouter();
  const logout = () => {
    auth.logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center gap-6">
      <Link href="/dashboard" className="hover:text-blue-400">
        Dashboard
      </Link>
      <Link href="/dashboard/users" className="hover:text-blue-400">
        Users
      </Link>
      <Link href="/dashboard/projects" className="hover:text-blue-400">
        Projects
      </Link>
      <Button onClick={logout} className="ml-auto bg-red-600 hover:bg-red-700">
        Logout
      </Button>
    </nav>
  );
}
