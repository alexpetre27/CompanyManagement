import { ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: "blue" | "purple" | "green" | "orange";
}

export interface TaskItemProps {
  label: string;
  sub: string;
  active?: boolean;
}
