const BASE = "/api" as const

export const API_ENDPOINTS = {
  HEALTH: `${BASE}/health`,
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
    REFRESH: `${BASE}/auth/refresh`,
    ME: `${BASE}/auth/me`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  },
  DASHBOARD: {
    RESUMEN: `${BASE}/dashboard/resumen`,
  },
  USERS: `${BASE}/users`,
  FINCAS: `${BASE}/fincas`,
  LOTES: `${BASE}/lotes`,
  CULTIVOS: `${BASE}/cultivos`,
  CLIENTES: `${BASE}/clientes`,
  PROVEEDORES: `${BASE}/proveedores`,
  PRODUCTOS: `${BASE}/productos`,
  MOVIMIENTOS: `${BASE}/movimientos`,
  VENTAS: `${BASE}/ventas`,
  GASTOS: `${BASE}/gastos`,
  TRABAJADORES: `${BASE}/trabajadores`,
  JORNALES: `${BASE}/jornales`,
  BITACORA: `${BASE}/bitacora`,
} as const

export const API_TIMEOUT = 15000
