import { apiGet, apiPost, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Configuracion, UpsertConfiguracionInput } from "../types/configuracion.types"

export const configuracionService = {
  async findAll(): Promise<Configuracion[]> {
    return apiGet<Configuracion[]>(API_ENDPOINTS.CONFIGURACION)
  },

  async findByLlave(llave: string): Promise<Configuracion> {
    return apiGet<Configuracion>(`${API_ENDPOINTS.CONFIGURACION}/${llave}`)
  },

  async upsert(llave: string, data: UpsertConfiguracionInput): Promise<Configuracion> {
    return apiPost<Configuracion>(`${API_ENDPOINTS.CONFIGURACION}/${llave}`, data)
  },

  async remove(llave: string): Promise<void> {
    return apiDelete<void>(`${API_ENDPOINTS.CONFIGURACION}/${llave}`)
  },
}
