import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Producto, CreateProductoInput, UpdateProductoInput, MovimientoInventario, CreateMovimientoInput } from "../types/inventario.types"

export const inventarioService = {
  async findAll(page?: number, limit?: number): Promise<Producto[]> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Producto[]>(API_ENDPOINTS.PRODUCTOS, { params })
  },

  async findById(id: number): Promise<Producto> {
    return apiGet<Producto>(`${API_ENDPOINTS.PRODUCTOS}/${id}`)
  },

  async create(data: CreateProductoInput): Promise<Producto> {
    return apiPost<Producto>(API_ENDPOINTS.PRODUCTOS, data)
  },

  async update(id: number, data: UpdateProductoInput): Promise<Producto> {
    return apiPut<Producto>(`${API_ENDPOINTS.PRODUCTOS}/${id}`, data)
  },

  async remove(id: number): Promise<Producto> {
    return apiDelete<Producto>(`${API_ENDPOINTS.PRODUCTOS}/${id}`)
  },

  async findMovimientos(productoId: number): Promise<MovimientoInventario[]> {
    return apiGet<MovimientoInventario[]>(`${API_ENDPOINTS.MOVIMIENTOS}?productoId=${productoId}`)
  },

  async createMovimiento(data: CreateMovimientoInput): Promise<MovimientoInventario> {
    return apiPost<MovimientoInventario>(API_ENDPOINTS.MOVIMIENTOS, data)
  },

  async deleteMovimiento(id: number): Promise<void> {
    return apiDelete(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`)
  },
}
