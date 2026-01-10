"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function Protected({ children, roles }: Props) {
  const auth = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) router.push("/login");
    if (roles && role && !roles.includes(role)) router.push("/dashboard");
  }, [router, roles]);

  return <>{children}</>;
}
