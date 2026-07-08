import { useState, useCallback, useMemo } from "react"
import type { PaginationState } from "@/types"

export interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
  total?: number
}

export interface UsePaginationReturn {
  page: number
  limit: number
  total: number
  totalPages: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setTotal: (total: number) => void
  nextPage: () => void
  prevPage: () => void
  canNextPage: boolean
  canPrevPage: boolean
  pagination: PaginationState
}

export function usePagination(props: UsePaginationProps = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, total = 0 } = props

  const [page, setPageState] = useState(initialPage)
  const [limit, setLimitState] = useState(initialLimit)
  const [totalItems, setTotal] = useState(total)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / limit)),
    [totalItems, limit],
  )

  const setPage = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages))
      setPageState(clamped)
    },
    [totalPages],
  )

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit)
    setPageState(1)
  }, [])

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage])
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage])

  const canNextPage = page < totalPages
  const canPrevPage = page > 1

  const pagination: PaginationState = {
    page,
    limit,
    total: totalItems,
    totalPages,
  }

  return {
    page,
    limit,
    total: totalItems,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    pagination,
  }
}
