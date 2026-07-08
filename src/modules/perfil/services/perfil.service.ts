import { apiGet, apiPut } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"

interface UserProfile {
  id: number
  nombre: string | null
  documento: string
  rol: string
  activo: boolean
  createdAt: string
}

export const perfilService = {
  async getProfile(userId: number): Promise<UserProfile> {
    return apiGet<UserProfile>(`${API_ENDPOINTS.USERS}/${userId}`)
  },

  async updateProfile(userId: number, data: { nombre?: string; documento?: string }): Promise<UserProfile> {
    return apiPut<UserProfile>(`${API_ENDPOINTS.USERS}/${userId}`, data)
  },

  async changePassword(userId: number, newPassword: string): Promise<UserProfile> {
    return apiPut<UserProfile>(`${API_ENDPOINTS.USERS}/${userId}`, { password: newPassword })
  },
}
