import type { User } from "@/types"

interface JWTPayload {
  id: number
  documento: string
  nombre: string | null
  rol: User["rol"]
  iat: number
  exp: number
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload) as JWTPayload
  } catch {
    return null
  }
}
