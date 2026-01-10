import api from "@/lib/axios";
import { LoginRequestDTO, LoginResponseDTO } from "@/types/auth";

export const login = async (
  data: LoginRequestDTO
): Promise<LoginResponseDTO> => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};
