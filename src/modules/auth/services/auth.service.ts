import { apiPost } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { AuthData, LoginInput, RegisterInput } from "../types/auth.types"

export const authService = {
  async login(data: LoginInput): Promise<AuthData> {
    return apiPost<AuthData>(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  async register(data: RegisterInput): Promise<AuthData> {
    return apiPost<AuthData>(API_ENDPOINTS.AUTH.REGISTER, data)
  },

  async refreshToken(token: string): Promise<AuthData> {
    return apiPost<AuthData>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: token })
  },
}
