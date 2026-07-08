export interface ApiErrorResponse {
  success: false
  error: string
  statusCode?: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
