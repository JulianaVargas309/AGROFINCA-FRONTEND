import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Role, CreateRoleInput, UpdateRoleInput } from "../types/role.types"

export const rolesService = {
  async findAll(): Promise<Role[]> {
    return apiGet<Role[]>(API_ENDPOINTS.ROLES)
  },

  async findById(id: number): Promise<Role> {
    return apiGet<Role>(`${API_ENDPOINTS.ROLES}/${id}`)
  },

  async create(data: CreateRoleInput): Promise<Role> {
    return apiPost<Role>(API_ENDPOINTS.ROLES, data)
  },

  async update(id: number, data: UpdateRoleInput): Promise<Role> {
    return apiPut<Role>(`${API_ENDPOINTS.ROLES}/${id}`, data)
  },

  async remove(id: number): Promise<Role> {
    return apiDelete<Role>(`${API_ENDPOINTS.ROLES}/${id}`)
  },
}
