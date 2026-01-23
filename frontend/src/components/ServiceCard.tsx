"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Activity, Hash, RefreshCw } from "lucide-react";
import { Microservice } from "@/types/microservice";
import { useSWRConfig } from "swr";

interface ServiceCardProps {
  service: Microservice;
  userRole: string | null;
}

export function ServiceCard({ service, userRole }: ServiceCardProps) {
  const [isRestarting, setIsRestarting] = useState(false);
  const { mutate } = useSWRConfig();
  const isAdmin = userRole === "ADMIN";

  const statusColors: Record<string, string> = {
    UP: "bg-green-500 hover:bg-green-600",
    DOWN: "bg-red-500 hover:bg-red-600",
    MAINTENANCE: "bg-yellow-500 hover:bg-yellow-600",
    STARTING: "bg-blue-500 hover:bg-blue-600",
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/${service.id}/restart`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        mutate("http://localhost:8080/api/services");
      }
    } catch (error) {
      console.error("Restart error:", error);
    } finally {
      setTimeout(() => setIsRestarting(false), 2000);
    }
  };

  return (
    <Card
      className="overflow-hidden border-l-4"
      style={{
        borderLeftColor: service.status === "UP" ? "#22c55e" : "#ef4444",
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Server className="h-4 w-4" />
            {service.name}
          </CardTitle>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            v{service.version}
          </span>
        </div>
        <Badge
          className={`${statusColors[service.status] || "bg-slate-500"} text-white border-none`}
        >
          {service.status}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" /> Endpoint
            </span>
            <span className="font-mono text-xs">
              {service.url}:{service.port}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" /> Uptime
            </span>
            <span>{service.uptime}</span>
          </div>
        </div>

        {isAdmin ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 mt-2"
            onClick={handleRestart}
            disabled={isRestarting || service.status === "DOWN"}
          >
            <RefreshCw
              className={`h-3 w-3 ${isRestarting ? "animate-spin" : ""}`}
            />
            {isRestarting ? "Restarting..." : "Restart Service"}
          </Button>
        ) : (
          <div className="pt-2 text-center">
            <span className="text-[10px] text-muted-foreground italic bg-slate-100 px-2 py-1 rounded">
              ReadOnly Access
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
