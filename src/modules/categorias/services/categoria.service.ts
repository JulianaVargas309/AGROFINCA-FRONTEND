import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { CategoriaProducto, CreateCategoriaInput, UpdateCategoriaInput } from "../types/categoria.types"
import type { PaginatedResponse } from "@/types"

export const categoriaService = {
  async findAll(page?: number, limit?: number): Promise<CategoriaProducto[] | PaginatedResponse<CategoriaProducto>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<CategoriaProducto[] | PaginatedResponse<CategoriaProducto>>(API_ENDPOINTS.CATEGORIAS, { params })
  },

  async findById(id: number): Promise<CategoriaProducto> {
    return apiGet<CategoriaProducto>(`${API_ENDPOINTS.CATEGORIAS}/${id}`)
  },

  async create(data: CreateCategoriaInput): Promise<CategoriaProducto> {
    return apiPost<CategoriaProducto>(API_ENDPOINTS.CATEGORIAS, data)
  },

  async update(id: number, data: UpdateCategoriaInput): Promise<CategoriaProducto> {
    return apiPut<CategoriaProducto>(`${API_ENDPOINTS.CATEGORIAS}/${id}`, data)
  },

  async remove(id: number): Promise<CategoriaProducto> {
    return apiDelete<CategoriaProducto>(`${API_ENDPOINTS.CATEGORIAS}/${id}`)
  },
}
