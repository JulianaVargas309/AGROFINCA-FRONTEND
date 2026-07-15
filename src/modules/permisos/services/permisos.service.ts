import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Permiso, CreatePermisoInput, UpdatePermisoInput } from "../types/permiso.types"

export const permisosService = {
  async findAll(): Promise<Permiso[]> {
    return apiGet<Permiso[]>(API_ENDPOINTS.PERMISOS)
  },

  async findById(id: number): Promise<Permiso> {
    return apiGet<Permiso>(`${API_ENDPOINTS.PERMISOS}/${id}`)
  },

  async create(data: CreatePermisoInput): Promise<Permiso> {
    return apiPost<Permiso>(API_ENDPOINTS.PERMISOS, data)
  },

  async update(id: number, data: UpdatePermisoInput): Promise<Permiso> {
    return apiPut<Permiso>(`${API_ENDPOINTS.PERMISOS}/${id}`, data)
  },

  async remove(id: number): Promise<Permiso> {
    return apiDelete<Permiso>(`${API_ENDPOINTS.PERMISOS}/${id}`)
  },
}
