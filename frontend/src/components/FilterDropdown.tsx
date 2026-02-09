import { FilterDropdownProps } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl min-w-[140px] transition-all
          ${value !== "ALL" ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"}`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="opacity-50">{label}</span>
          {selected?.label}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-full rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 py-1 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs flex items-center gap-2 transition-colors
                  ${value === opt.value ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
