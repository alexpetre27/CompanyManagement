export interface AuthRequestDTO {
  username: string;
  email: string;
  password: string;
}
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  id: number;
  email: string;
  username: string;
  projectIds: number[];
}
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
export interface CreateProjectRequestDTO {
  name: string;
  description: string;
}
export interface ProjectResponseDTO {
  id: number;
  name: string;
  userIds: number[];
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  projectIds: number[];
}

export interface UserProjectDTO {
  userId: number;
  projectId: number;
  projectName: string;
}

export interface UserCreateRequestDTO {
  username: string;
  email: string;
  password: string;
  projectIds: number[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
declare module "next-auth" {
  interface User {
    username?: string;
    projectId?: number;
    token?: string;
  }
  interface Session {
    User: User & {
      id?: number;
      username?: string;
      projectId?: number;
      token?: string;
      role?: string;
    };
    backendToken?: string;
  }
}
