import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Recordatorio, CreateRecordatorioInput } from "../types/calendario.types"

export const recordatorioService = {
  async findAll(eventoId?: number): Promise<Recordatorio[]> {
    const params: Record<string, string> = {}
    if (eventoId) params.eventoCalendarioId = String(eventoId)
    return apiGet<Recordatorio[]>(API_ENDPOINTS.RECORDATORIOS, { params })
  },

  async findById(id: number): Promise<Recordatorio> {
    return apiGet<Recordatorio>(`${API_ENDPOINTS.RECORDATORIOS}/${id}`)
  },

  async create(data: CreateRecordatorioInput): Promise<Recordatorio> {
    return apiPost<Recordatorio>(API_ENDPOINTS.RECORDATORIOS, data)
  },

  async update(id: number, data: Partial<CreateRecordatorioInput>): Promise<Recordatorio> {
    return apiPut<Recordatorio>(`${API_ENDPOINTS.RECORDATORIOS}/${id}`, data)
  },

  async marcarEnviado(id: number): Promise<Recordatorio> {
    return apiPatch<Recordatorio>(`${API_ENDPOINTS.RECORDATORIOS}/${id}/enviado`)
  },

  async remove(id: number): Promise<Recordatorio> {
    return apiDelete<Recordatorio>(`${API_ENDPOINTS.RECORDATORIOS}/${id}`)
  },
}
