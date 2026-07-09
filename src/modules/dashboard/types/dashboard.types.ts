export interface DashboardStats {
  totalFincas: number
  totalLotes: number
  totalProductos: number
  gastosMes: number
  ingresosMes: number
  balance: number
  totalAreaSembrada: number
  produccionCafe: number
  produccionCania: number
  roi: number
  cultivosActivos: number
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

export interface UltimoMovimiento {
  id: number
  tipo: string
  cantidad: number
  unidadMedida: string
  fecha: string
  producto?: { id: number; nombre: string }
}

export interface DashboardData {
  stats: DashboardStats
  actividadesRecientes: ActividadReciente[]
  stockBajo: ProductoStockBajo[]
  ventasResumen: VentasResumen
  gastosPorCategoria: GastosResumen[]
  ultimosMovimientos: UltimoMovimiento[]
}
