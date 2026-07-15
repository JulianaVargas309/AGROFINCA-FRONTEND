import { apiGet, apiPut } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { PerfilData } from "../types/perfil.types"

export const perfilService = {
  async getProfile(): Promise<PerfilData> {
    return apiGet<PerfilData>(API_ENDPOINTS.AUTH.ME)
  },

  async updateProfile(userId: number, data: { nombre?: string; documento?: string }): Promise<PerfilData> {
    return apiPut<PerfilData>(`${API_ENDPOINTS.USERS}/${userId}`, data)
  },

  async changePassword(userId: number, newPassword: string): Promise<PerfilData> {
    return apiPut<PerfilData>(`${API_ENDPOINTS.USERS}/${userId}`, { password: newPassword })
  },
}
