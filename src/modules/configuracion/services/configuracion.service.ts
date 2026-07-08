import type { User } from "@/types"

export const configuracionService = {
  getCurrentConfig() {
    const stored = localStorage.getItem("agrofinca_token")
    return { user: null as User | null, hasSession: !!stored }
  },
}
