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
  recentProjects: Array<{
    id: string;
    name: string;
    version: string;
    updatedAt: string;
    teamCount: number;
  }>;
  todayTasks: Array<{
    id: string;
    title: string;
    projectName: string;
    isCompleted: boolean;
  }>;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: "blue" | "purple" | "green" | "orange";
}
