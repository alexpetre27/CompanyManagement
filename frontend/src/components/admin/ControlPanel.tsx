"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Power,
  RefreshCw,
  Eraser,
  Lock,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { adminAction, type AdminActionKey } from "@/lib/actions/admin";

type BtnColor = "indigo" | "orange" | "slate" | "rose";

export function ControlPanel() {
  const [loading, setLoading] = useState<string | null>(null);

  const execute = async (actionKey: AdminActionKey, label: string) => {
    if (!confirm(`CONFIRM: Execute ${label}?`)) return;

    setLoading(actionKey);
    try {
      const res = await adminAction(actionKey);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Execution failed due to client error.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border-none shadow-md bg-white rounded-xl p-6 h-full flex flex-col justify-center">
      <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2">
        <ShieldAlert size={16} className="text-indigo-600" /> Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Btn
          icon={RefreshCw}
          label="Restart"
          color="indigo"
          loading={loading === "restart"}
          onClick={() => execute("restart", "Restart API")}
        />
        <Btn
          icon={Eraser}
          label="Flush Cache"
          color="orange"
          loading={loading === "flush"}
          onClick={() => execute("flush", "Flush Cache")}
        />
        <Btn
          icon={Lock}
          label="Maintenance"
          color="slate"
          loading={loading === "lock"}
          onClick={() => execute("lock", "Toggle maintenance mode (only admins can use the API)")}
        />
        <Btn
          icon={Power}
          label="Shutdown"
          color="rose"
          loading={loading === "kill"}
          onClick={() => execute("kill", "Emergency Stop (the backend will exit)")}
        />
      </div>
    </Card>
  );
}

interface BtnProps {
  icon: LucideIcon;
  label: string;
  color: BtnColor;
  onClick: () => void;
  loading: boolean;
}

function Btn({ icon: Icon, label, color, onClick, loading }: BtnProps) {
  const styles: Record<BtnColor, string> = {
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100",
    orange:
      "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95",
        styles[color],
        loading && "opacity-70 cursor-not-allowed",
      )}
    >
      <Icon size={20} className={cn("mb-1", loading && "animate-spin")} />
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
  );
}
