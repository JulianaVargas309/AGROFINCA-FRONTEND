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
  totalTrabajadoresActivos?: number
  jornalesDelDia?: number
  ganancias?: number
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

export interface DashboardResumen {
  totalFincas: number
  totalLotes: number
  cultivosActivos: number
  trabajadoresActivos: number
  jornalesDelDia: number
  actividadesPendientes: number
  eventosHoy: number
  inventarioCritico: number
  ventasDelMes: number
  gastosDelMes: number
  utilidadEstimada: number
  produccionPorCultivo: { cultivo: string; total: number }[]
  notificacionesNoLeidas: number
}
