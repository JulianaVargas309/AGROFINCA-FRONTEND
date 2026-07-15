import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { ActividadSeguimiento, CreateActividadInput, UpdateActividadInput } from "../types/actividades.types"

export const actividadService = {
  async findAll(page?: number, limit?: number): Promise<ActividadSeguimiento[]> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<ActividadSeguimiento[]>(API_ENDPOINTS.ACTIVIDADES, { params })
  },

  async findById(id: number): Promise<ActividadSeguimiento> {
    return apiGet<ActividadSeguimiento>(`${API_ENDPOINTS.ACTIVIDADES}/${id}`)
  },

  async create(data: CreateActividadInput): Promise<ActividadSeguimiento> {
    return apiPost<ActividadSeguimiento>(API_ENDPOINTS.ACTIVIDADES, data)
  },

  async update(id: number, data: UpdateActividadInput): Promise<ActividadSeguimiento> {
    return apiPut<ActividadSeguimiento>(`${API_ENDPOINTS.ACTIVIDADES}/${id}`, data)
  },

  async updateEstado(id: number, estado: string): Promise<ActividadSeguimiento> {
    return apiPatch<ActividadSeguimiento>(`${API_ENDPOINTS.ACTIVIDADES}/${id}/estado`, { estado })
  },

  async remove(id: number): Promise<ActividadSeguimiento> {
    return apiDelete<ActividadSeguimiento>(`${API_ENDPOINTS.ACTIVIDADES}/${id}`)
  },
}
