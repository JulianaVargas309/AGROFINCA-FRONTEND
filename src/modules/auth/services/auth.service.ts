import { apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { AuthData, LoginInput, RegisterInput } from "../types/auth.types"

interface ApiResponseWrapper<T> {
  success: boolean
  data: T
  message?: string
}

function unwrapResponse<T>(response: ApiResponseWrapper<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    const wrapped = response as ApiResponseWrapper<T>
    if (!wrapped.success) {
      throw new Error(wrapped.message || "Error en la respuesta del servidor")
    }
    return wrapped.data
  }
  return response as T
}

export const authService = {
  async login(data: LoginInput): Promise<AuthData> {
    const response = await apiPost<ApiResponseWrapper<AuthData> | AuthData>(API_ENDPOINTS.AUTH.LOGIN, data)
    return unwrapResponse(response)
  },

  async register(data: RegisterInput): Promise<AuthData> {
    const response = await apiPost<ApiResponseWrapper<AuthData> | AuthData>(API_ENDPOINTS.AUTH.REGISTER, data)
    return unwrapResponse(response)
  },

  async refreshToken(token: string): Promise<AuthData> {
    const response = await apiPost<ApiResponseWrapper<AuthData> | AuthData>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: token })
    return unwrapResponse(response)
  },

  async forgotPassword(documento: string): Promise<{ message: string }> {
    const response = await apiPost<ApiResponseWrapper<{ message: string }> | { message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { documento })
    return unwrapResponse(response)
  },
}
