"use client";

import { FilterDropdownProps } from "@/types/user";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function FilterDropdownPortal({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updateCoords = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  const toggleDropdown = () => {
    updateCoords();
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };

    window.addEventListener("resize", updateCoords);
    document.addEventListener("mousedown", handler);

    return () => {
      window.removeEventListener("resize", updateCoords);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, updateCoords]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl min-w-35 transition-all
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
        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-9998"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                style={{
                  position: "absolute",
                  top: coords.top + 8,
                  left: coords.left,
                  width: coords.width,
                  zIndex: 9999,
                }}
                className="rounded-xl bg-white shadow-2xl ring-1 ring-black/5 py-1 overflow-hidden"
              >
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-xs flex items-center gap-2 transition-colors
                    ${value === opt.value ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            </>,
            document.body,
          )}
      </AnimatePresence>
    </div>
  );
}
