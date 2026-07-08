import { apiGet } from "./api"
import { API_ENDPOINTS } from "@/constants/api"

export interface HealthResponse {
  success: boolean
  message: string
}

export async function getHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>(API_ENDPOINTS.HEALTH)
}
