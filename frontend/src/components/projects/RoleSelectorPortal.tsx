"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  { value: "ROLE_USER", label: "Developer" },
  { value: "ROLE_MANAGER", label: "Manager" },
  { value: "ROLE_DESIGNER", label: "Designer" },
];

export function RoleSelectorPortal({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRole = roles.find((r) => r.value === value) || roles[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:bg-slate-50",
          isOpen && "ring-4 ring-indigo-50 border-indigo-400",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-bold text-slate-600 truncate">
          <ShieldCheck size={16} className="text-indigo-500 shrink-0" />
          {selectedRole.label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-2xl border border-slate-100 py-1 overflow-hidden z-100"
          >
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  onSelect(role.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors text-left",
                  value === role.value
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50",
                )}
              >
                {role.label}
                {value === role.value && (
                  <Check size={14} className="text-indigo-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
