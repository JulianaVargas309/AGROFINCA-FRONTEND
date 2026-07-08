export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiCollectionResponse<T> {
  success: true
  data: T[]
}

export interface ApiSingleResponse<T> {
  success: true
  data: T
}
