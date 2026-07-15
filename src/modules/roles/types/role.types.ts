export interface Role {
  id: number
  nombre: string
  descripcion?: string | null
  nivel: number
  activo: boolean
  createdAt: string
  permissions?: RolePermission[]
}

export interface RolePermission {
  roleId: number
  permissionId: number
  permission: Permission
}

export interface Permission {
  id: number
  nombre: string
  descripcion?: string | null
  modulo?: string | null
}

export interface CreateRoleInput {
  nombre: string
  descripcion?: string
  nivel?: number
  permissionIds?: number[]
}

export interface UpdateRoleInput {
  nombre?: string
  descripcion?: string
  nivel?: number
  permissionIds?: number[]
}
