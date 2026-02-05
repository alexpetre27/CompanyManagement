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
