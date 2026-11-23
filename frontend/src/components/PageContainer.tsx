"use client";

import { motion } from "framer-motion";

export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full flex flex-col gap-6 ${className || ""}`}
    >
      {children}
    </motion.div>
  );
};
