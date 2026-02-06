export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  avatar?: string;
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
