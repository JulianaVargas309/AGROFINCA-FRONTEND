import { createContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { authService } from "@/modules/auth/services/auth.service"
import { setToken, setRefreshToken, removeAllTokens, getToken } from "@/services/token"
import type { User, LoginCredentials, RegisterData } from "@/types"
import type { AuthData } from "@/modules/auth/types/auth.types"

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(getToken())
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!token && !!user

  const logout = useCallback(() => {
    removeAllTokens()
    setTokenState(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    import("./jwt").then(({ decodeToken }) => {
      try {
        const decoded = decodeToken(token)
        if (decoded) {
          setUser({
            id: decoded.id,
            nombre: decoded.nombre,
            documento: decoded.documento,
            rol: decoded.rol,
            activo: true,
            createdAt: "",
            updatedAt: "",
          })
        } else {
          logout()
        }
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    })
  }, [token, logout])

  const setAuthState = useCallback((response: AuthData) => {
    setToken(response.accessToken)
    setRefreshToken(response.refreshToken)
    setTokenState(response.accessToken)
    setUser({
      id: response.user.id,
      nombre: response.user.nombre ?? response.user.documento,
      documento: response.user.documento,
      correo: response.user.correo,
      telefono: response.user.telefono,
      ultimoAcceso: response.user.ultimoAcceso,
      foto: response.user.foto,
      rol: response.user.rol as User["rol"],
      activo: response.user.activo ?? true,
      createdAt: response.user.createdAt ?? "",
      updatedAt: "",
    })
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setAuthState(response)
  }, [setAuthState])

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data)
    setAuthState(response)
  }, [setAuthState])

  return (
    <AuthContext value={{ user, token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext>
  )
}
