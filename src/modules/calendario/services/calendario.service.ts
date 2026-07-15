import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { EventoCalendario, CreateEventoInput, UpdateEventoInput } from "../types/calendario.types"

export const calendarioService = {
  async findAll(filtros?: { fechaDesde?: string; fechaHasta?: string; tipo?: string; loteId?: number; fincaId?: number; cultivoId?: number }): Promise<EventoCalendario[]> {
    const params: Record<string, string> = {}
    if (filtros?.fechaDesde) params.fechaDesde = filtros.fechaDesde
    if (filtros?.fechaHasta) params.fechaHasta = filtros.fechaHasta
    if (filtros?.tipo) params.tipo = filtros.tipo
    if (filtros?.loteId) params.loteId = String(filtros.loteId)
    if (filtros?.fincaId) params.fincaId = String(filtros.fincaId)
    if (filtros?.cultivoId) params.cultivoId = String(filtros.cultivoId)
    return apiGet<EventoCalendario[]>(API_ENDPOINTS.CALENDARIO, { params })
  },

  async findById(id: number): Promise<EventoCalendario> {
    return apiGet<EventoCalendario>(`${API_ENDPOINTS.CALENDARIO}/${id}`)
  },

  async create(data: CreateEventoInput): Promise<EventoCalendario> {
    return apiPost<EventoCalendario>(API_ENDPOINTS.CALENDARIO, data)
  },

  async update(id: number, data: UpdateEventoInput): Promise<EventoCalendario> {
    return apiPut<EventoCalendario>(`${API_ENDPOINTS.CALENDARIO}/${id}`, data)
  },

  async remove(id: number): Promise<EventoCalendario> {
    return apiDelete<EventoCalendario>(`${API_ENDPOINTS.CALENDARIO}/${id}`)
  },
}
