export interface DashboardStats {
  totalFincas: number
  totalLotes: number
  totalProductos: number
  gastosMes: number
  ingresosMes: number
  balance: number
}

export interface ActividadReciente {
  id: number
  actividad: string
  descripcion: string
  fecha: string
  lote?: string
  usuario?: string
}

export interface ProductoStockBajo {
  id: number
  nombre: string
  stockActual: number
  stockMinimo: number
  unidadMedida: string
}

export interface VentasResumen {
  total: number
  completadas: number
}

export interface GastosResumen {
  total: number
  categoria: string
}

export interface DashboardData {
  stats: DashboardStats
  actividadesRecientes: ActividadReciente[]
  stockBajo: ProductoStockBajo[]
  ventasResumen: VentasResumen
  gastosPorCategoria: GastosResumen[]
}
