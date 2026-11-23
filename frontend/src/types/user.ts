export type ProjectRole = "DEVELOPER" | "MANAGER" | "DESIGNER";

/** Shape returned by the Spring Boot API (UserResponseDTO). */
export interface BackendUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
  notificationsEnabled?: boolean | null;
  themePreference?: string | null;
  projectId?: number | null;
  projectName?: string | null;
  projectRole?: ProjectRole | null;
}

/** Normalised user used by the UI. */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  projectId: number | null;
  /** Name of the assigned project, or "" when unassigned. */
  project: string;
  projectRole: ProjectRole | null;
  notificationsEnabled: boolean;
  themePreference: string;
}

export interface UsersTableProps {
  initialUsers: User[];
  currentUserRole: string;
}

export interface SettingsViewProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    notificationsEnabled?: boolean;
    themePreference?: string;
  };
}
