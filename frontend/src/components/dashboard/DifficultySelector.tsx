"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  themeConfig,
  DifficultyLevel,
  DifficultySelectorProps,
} from "@/types/dashboard";

export function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(Object.keys(themeConfig) as Array<DifficultyLevel>).map((level) => {
        const isSelected = value === level;
        const theme = themeConfig[level];

        return (
          <motion.div
            key={level}
            onClick={() => onChange(level)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "cursor-pointer relative flex flex-col items-center justify-center p-3 h-24 rounded-2xl border-2 transition-all duration-300",
              isSelected
                ? cn("bg-white shadow-md", theme.border)
                : "bg-white/50 border-transparent hover:bg-white hover:border-slate-100",
            )}
          >
            <div
              className={cn(
                "mb-2 p-1.5 rounded-full transition-colors",
                isSelected ? theme.bg : "bg-slate-100",
              )}
            >
              <theme.icon
                size={18}
                className={isSelected ? theme.accent : "text-slate-400"}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                isSelected ? theme.accent : "text-slate-400",
              )}
            >
              {level}
            </span>

            {isSelected && (
              <motion.div
                layoutId="active-dot"
                className={cn(
                  "absolute top-2 right-2 w-2 h-2 rounded-full",
                  theme.button.split(" ")[0],
                )}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
