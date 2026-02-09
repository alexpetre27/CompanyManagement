import { AlertCircle, CheckCircle2, Flame } from "lucide-react";
import { Project } from "./project";

export interface Task {
  id: string;
  title: string;
  projectName: string;
  isCompleted: boolean;
}

export interface DashboardData {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  stats: {
    activeProjects: number;
    teamMembers: number;
    hoursWorked: number;
    productivity: number;
  };
  recentProjects: Project[];
  todayTasks: Task[];
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: "blue" | "purple" | "green" | "orange";
}
export type DifficultyLevel = "LOW" | "MEDIUM" | "HIGH";
export interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}
export const themeConfig = {
  LOW: {
    bg: "bg-emerald-50/30",
    border: "border-emerald-100",
    accent: "text-emerald-600",
    ring: "focus:ring-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    icon: CheckCircle2,
    gradient: "from-emerald-50/50 to-white",
  },
  MEDIUM: {
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    accent: "text-amber-600",
    ring: "focus:ring-amber-100",
    button: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
    icon: AlertCircle,
    gradient: "from-amber-50/50 to-white",
  },
  HIGH: {
    bg: "bg-rose-50/30",
    border: "border-rose-100",
    accent: "text-rose-600",
    ring: "focus:ring-rose-100",
    button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
    icon: Flame,
    gradient: "from-rose-50/50 to-white",
  },
};
export interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}
export interface TasksCardProps {
  tasks: Task[];
  projects: Project[];
}
