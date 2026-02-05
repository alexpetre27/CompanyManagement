export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export interface ProjectsViewProps {
  initialProjects: Project[];
  isAdmin: boolean;
}
export interface Project {
  port?: number;
  uptime?: string;
  url?: string;
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  version: string;
  updatedAt: string;
  teamCount: number;

  techStack?: string[];
  team?: ProjectMember[];
  repoUrl?: string;
  liveUrl?: string;
}
