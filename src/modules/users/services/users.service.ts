import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { User, CreateUserInput, UpdateUserInput } from "../types/user.types"

export const usersService = {
  async findAll(): Promise<User[]> {
    return apiGet<User[]>(API_ENDPOINTS.USERS)
  },

  async findById(id: number): Promise<User> {
    return apiGet<User>(`${API_ENDPOINTS.USERS}/${id}`)
  },

  async create(data: CreateUserInput): Promise<User> {
    return apiPost<User>(API_ENDPOINTS.USERS, data)
  },

  async update(id: number, data: UpdateUserInput): Promise<User> {
    return apiPut<User>(`${API_ENDPOINTS.USERS}/${id}`, data)
  },

  async remove(id: number): Promise<User> {
    return apiDelete<User>(`${API_ENDPOINTS.USERS}/${id}`)
  },

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    return apiPatch(`${API_ENDPOINTS.USERS}/${id}/password`, { currentPassword, newPassword })
  },

  async changeRol(id: number, rol: string, roleId?: number): Promise<User> {
    return apiPatch<User>(`${API_ENDPOINTS.USERS}/${id}/rol`, { rol, roleId })
  },

  async search(query: string): Promise<User[]> {
    return apiGet<User[]>(`${API_ENDPOINTS.USERS}/search?q=${query}`)
  },
}
