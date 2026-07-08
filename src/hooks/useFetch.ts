import { useState, useCallback, useRef, useEffect } from "react"
import { apiGet } from "@/services/api"
import type { PaginationState } from "@/types"

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>
  setData: (data: T | null) => void
}

export function useFetch<T>(url: string): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await apiGet<T>(url)
      if (mountedRef.current) {
        setState({ data: response, loading: false, error: null })
      }
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : "Error al cargar datos"
        setState({ data: null, loading: false, error: message })
      }
    }
  }, [url])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => {
      mountedRef.current = false
    }
  }, [fetchData])

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }))
  }, [])

  return { ...state, refetch: fetchData, setData }
}

interface UseFetchPaginatedState<T> {
  data: T[]
  pagination: PaginationState
  loading: boolean
  error: string | null
}

interface UseFetchPaginatedReturn<T> extends UseFetchPaginatedState<T> {
  refetch: () => Promise<void>
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

export function useFetchPaginated<T>(
  url: string,
  initialPage: number = 1,
  initialLimit: number = 10,
): UseFetchPaginatedReturn<T> {
  const [page, setPageState] = useState(initialPage)
  const [limit, setLimitState] = useState(initialLimit)
  const [state, setState] = useState<UseFetchPaginatedState<T>>({
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: true,
    error: null,
  })

  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const queryUrl = `${url}?page=${page}&limit=${limit}`
      const response = await apiGet<T[]>(queryUrl)
      if (mountedRef.current) {
        setState({
          data: response,
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 1,
          },
          loading: false,
          error: null,
        })
      }
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : "Error al cargar datos"
        setState((prev) => ({ ...prev, loading: false, error: message }))
      }
    }
  }, [url, page, limit])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => {
      mountedRef.current = false
    }
  }, [fetchData])

  const setPage = useCallback((newPage: number) => setPageState(newPage), [])
  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit)
    setPageState(1)
  }, [])

  return { ...state, refetch: fetchData, setPage, setLimit }
}
