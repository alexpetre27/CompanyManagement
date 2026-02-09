export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  avatar?: string;
  project: string;
}
export interface FilterDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  onChange: (val: string) => void;
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
export interface AdminStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}
