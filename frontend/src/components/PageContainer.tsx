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

export const CardHover = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.2)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
