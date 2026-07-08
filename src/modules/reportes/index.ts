export { default as ReportesPage } from "./pages/ReportesPage"
export { ReporteTable } from "./components/ReporteTable"
export { ReporteForm } from "./components/ReporteForm"
export { ReporteCard } from "./components/ReporteCard"
export type { ReporteCardProps } from "./components/ReporteCard"
export { reportesService } from "./services/reportes.service"
export { useReportes } from "./hooks/useReportes"
export { REPORT_TYPES } from "./types/reporte.types"
export type {
  ReportType,
  ReporteInventario,
  ReporteFinanciero,
  ReporteProduccion,
  ReporteCostos,
  ReporteBitacora,
} from "./types/reporte.types"
