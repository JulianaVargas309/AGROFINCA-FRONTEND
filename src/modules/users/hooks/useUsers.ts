import { useState, useEffect, useCallback, useRef } from "react"
import { usersService } from "../services/users.service"
import type { User } from "../types/user.types"

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (search: string) => void
  refetch: () => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await usersService.findAll()
      if (mountedRef.current) setUsers(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar usuarios")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchUsers()
    return () => { mountedRef.current = false }
  }, [fetchUsers])

  const filtered = users.filter((u) =>
    search
      ? u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.documento.toLowerCase().includes(search.toLowerCase()) ||
        (u.correo && u.correo.toLowerCase().includes(search.toLowerCase()))
      : true
  )

  return { users: filtered, loading, error, search, setSearch, refetch: fetchUsers }
}
