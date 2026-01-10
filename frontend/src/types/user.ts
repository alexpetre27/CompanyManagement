import { ProjectResponseDTO } from "./project";
export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  projects: ProjectResponseDTO[];
}
