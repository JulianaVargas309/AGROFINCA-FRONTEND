import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Bitacora, CreateBitacoraInput, UpdateBitacoraInput, BitacoraFilters } from "../types/bitacora.types"
import type { PaginatedResponse } from "@/types"

interface Finca { id: number; nombre: string }
interface Lote { id: number; nombre: string; fincaId: number }
interface Cultivo { id: number; nombre: string; tipo: string; loteId: number }
interface Producto { id: number; nombre: string }

export const bitacoraService = {
  async findAll(filters?: BitacoraFilters): Promise<Bitacora[] | PaginatedResponse<Bitacora>> {
    const params: Record<string, unknown> = {}
    if (filters?.loteId) params.loteId = filters.loteId
    if (filters?.cultivoId) params.cultivoId = filters.cultivoId
    if (filters?.fechaDesde) params.fechaDesde = filters.fechaDesde
    if (filters?.fechaHasta) params.fechaHasta = filters.fechaHasta
    if (filters?.actividad) params.actividad = filters.actividad
    if (filters?.page) params.page = filters.page
    if (filters?.limit) params.limit = filters.limit
    return apiGet<Bitacora[] | PaginatedResponse<Bitacora>>(API_ENDPOINTS.BITACORA, { params })
  },

  async findById(id: number): Promise<Bitacora> {
    return apiGet<Bitacora>(`${API_ENDPOINTS.BITACORA}/${id}`)
  },

  async create(data: CreateBitacoraInput): Promise<Bitacora> {
    return apiPost<Bitacora>(API_ENDPOINTS.BITACORA, data)
  },

  async update(id: number, data: UpdateBitacoraInput): Promise<Bitacora> {
    return apiPut<Bitacora>(`${API_ENDPOINTS.BITACORA}/${id}`, data)
  },

  async remove(id: number): Promise<void> {
    await apiDelete(`${API_ENDPOINTS.BITACORA}/${id}`)
  },

  async fetchFincas(): Promise<Finca[]> {
    return apiGet<Finca[]>(API_ENDPOINTS.FINCAS)
  },

  async fetchLotes(fincaId: number): Promise<Lote[]> {
    return apiGet<Lote[]>(`${API_ENDPOINTS.LOTES}?fincaId=${fincaId}`)
  },

  async fetchCultivos(loteId: number): Promise<Cultivo[]> {
    return apiGet<Cultivo[]>(`${API_ENDPOINTS.CULTIVOS}?loteId=${loteId}`)
  },

  async fetchProductos(): Promise<Producto[]> {
    return apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS)
  },
}
