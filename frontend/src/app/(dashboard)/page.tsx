"use client";

import { Badge } from "@/components/ui/badge";
import ServiceList from "@/components/ServiceList";
import { useState } from "react";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_role");
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Microservices Fleet
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected as:{" "}
            <span className="font-semibold text-slate-700 capitalize">
              {userRole || "Guest"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-600">
              Live Monitoring
            </span>
          </div>

          <Badge
            variant="outline"
            className={
              userRole === "ADMIN"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-green-50 border-green-200 text-green-700"
            }
          >
            {userRole === "ADMIN" ? "Admin Access" : "View Only"}
          </Badge>
        </div>
      </header>

      <ServiceList userRole={userRole} />
    </div>
  );
}
