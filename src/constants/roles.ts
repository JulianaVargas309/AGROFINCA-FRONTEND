import { type Rol } from "@/types"

export const ROLES: Record<Rol, string> = {
  ADMIN: "Administrador",
  FAMILIAR: "Familiar",
  CONSULTA: "Consulta",
  TRABAJADOR: "Trabajador",
} as const

export { Rol } from "@/types"

export const ROLES_HIERARCHY: Record<Rol, number> = {
  ADMIN: 4,
  FAMILIAR: 3,
  TRABAJADOR: 2,
  CONSULTA: 1,
}

export const ROLES_LIST = [
  { value: "ADMIN" as const, label: "Administrador" },
  { value: "FAMILIAR" as const, label: "Familiar" },
  { value: "TRABAJADOR" as const, label: "Trabajador" },
  { value: "CONSULTA" as const, label: "Consulta" },
]
