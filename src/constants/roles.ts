import { type Rol } from "@/types"

export const ROLES: Record<Rol, string> = {
  ADMIN: "Administrador",
  FAMILIAR: "Familiar",
  CONSULTA: "Consulta",
} as const

export { Rol } from "@/types"

export const ROLES_HIERARCHY: Record<Rol, number> = {
  ADMIN: 3,
  FAMILIAR: 2,
  CONSULTA: 1,
}

export const ROLES_LIST = [
  { value: "ADMIN" as const, label: "Administrador" },
  { value: "FAMILIAR" as const, label: "Familiar" },
  { value: "CONSULTA" as const, label: "Consulta" },
]
