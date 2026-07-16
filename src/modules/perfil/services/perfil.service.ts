import { apiGet, apiPut, apiPatch } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { PerfilData } from "../types/perfil.types"

export const perfilService = {
  async getProfile(userId: number): Promise<PerfilData> {
    return apiGet<PerfilData>(`${API_ENDPOINTS.USERS}/${userId}`)
  },

  async updateProfile(userId: number, data: { nombre?: string; documento?: string; correo?: string; telefono?: string }): Promise<PerfilData> {
    return apiPatch<PerfilData>(`${API_ENDPOINTS.USERS}/${userId}/profile`, data)
  },

  async changePassword(userId: number, newPassword: string): Promise<PerfilData> {
    return apiPut<PerfilData>(`${API_ENDPOINTS.USERS}/${userId}`, { password: newPassword })
  },
}
