import { DefaultSession } from "next-auth";

export interface LoginRequestDTO {
  identifier: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  username: string;
  role: string;
}

export interface UserCreateRequestDTO {
  username: string;
  email: string;
  password: string;
  role?: string;
  avatar?: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface CreateProjectRequestDTO {
  name: string;
  description: string;
  version: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  teamMembers?: string[];
}
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      role?: string;
      avatar?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    token?: string;
    role?: string;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    role?: string;
    avatar?: string | null;
  }
}
