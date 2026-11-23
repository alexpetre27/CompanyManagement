export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | string;

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  version: string;
  updatedAt: string;
  teamCount: number;
  port?: number | null;
  uptime?: string | null;
  techStack?: string[];
  team?: ProjectMember[];
  repoUrl?: string | null;
  liveUrl?: string | null;
}

export interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export interface ProjectsToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export interface ProjectSelectorProps {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
  themeRing: string;
}

export interface CreateProjectPayload {
  name: string;
  version: string;
  port: number;
  description: string;
  repoUrl: string;
  liveUrl: string;
  techStack: string[];
  teamMembers: string[];
}
