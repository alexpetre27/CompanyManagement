import { Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Log } from "@/types/dashboard";

export function AuditTerminal({ logs }: { logs: Log[] }) {
  return (
    <Card className="bg-slate-900 border-none shadow-xl rounded-xl overflow-hidden text-slate-300 h-full min-h-75 flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
        <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-2">
          <Terminal size={12} /> LIVE_LOGS
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-4 font-mono text-[10px] space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700">
        {logs.map((log, i) => (
          <div
            key={i}
            className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity"
          >
            <span className="text-slate-500">[{log.time}]</span>
            <span
              className={
                log.type === "INFO"
                  ? "text-blue-400"
                  : log.type === "ERROR"
                    ? "text-red-400"
                    : "text-emerald-400"
              }
            >
              {log.type}
            </span>
            <span className="text-slate-300">{log.msg}</span>
          </div>
        ))}
        <div className="animate-pulse text-emerald-500 mt-2">_</div>
      </div>
    </Card>
  );
}
