import { useState, useCallback } from "react"
import { reportesService } from "../services/reportes.service"
import type {
  ReporteInventario,
  ReporteFinanciero,
  ReporteProduccion,
  ReporteCostos,
  ReporteBitacora,
  ReportType,
} from "../types/reporte.types"

type ReportData = ReporteInventario | ReporteFinanciero | ReporteProduccion | ReporteCostos | ReporteBitacora

interface UseReportesReturn {
  data: ReportData | null
  loading: boolean
  error: string | null
  reportType: ReportType | null
  generate: (type: ReportType) => Promise<void>
  exportCSV: () => void
  exportPDF: () => void
}

export function useReportes(): UseReportesReturn {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState<ReportType | null>(null)

  const generate = useCallback(async (type: ReportType) => {
    setLoading(true)
    setError(null)
    setReportType(type)
    try {
      const result = await reportesService.generateReport(type)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar reporte")
    } finally {
      setLoading(false)
    }
  }, [])

  const exportCSV = useCallback(() => {
    if (!data || !reportType) return
    const csv = convertToCSV(reportType, data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte_${reportType}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, reportType])

  const exportPDF = useCallback(() => {
    window.print()
  }, [])

  return { data, loading, error, reportType, generate, exportCSV, exportPDF }
}

function convertToCSV(type: ReportType, data: ReportData): string {
  switch (type) {
    case "inventario": {
      const d = data as ReporteInventario
      const rows = ["Producto,Categoría,Stock,Mínimo,Unidad,Precio,Valor Total"]
      d.productos.forEach((p) => rows.push(`"${p.nombre}","${p.categoria}",${p.stockActual},${p.stockMinimo},"${p.unidadMedida}",${p.precioUnitario || 0},${p.valorTotal}`))
      rows.push(`\nTotal productos,${d.totalProductos}`)
      rows.push(`Valor inventario,${d.valorInventario}`)
      rows.push(`Stock bajo,${d.stockBajo}`)
      return rows.join("\n")
    }
    case "financiero": {
      const d = data as ReporteFinanciero
      const rows = ["Mes,Ingresos,Gastos"]
      d.ingresos.forEach((ing, i) => rows.push(`"${ing.mes}",${ing.total},${d.gastos[i]?.total || 0}`))
      rows.push(`\nTotal Ingresos,${d.totalIngresos}`)
      rows.push(`Total Gastos,${d.totalGastos}`)
      return rows.join("\n")
    }
    case "produccion": {
      const d = data as ReporteProduccion
      const rows = ["Cultivo,Tipo,Lote,Finca,Estado,Siembra,Rendimiento Est.,Gastos"]
      d.cultivos.forEach((c) => rows.push(`"${c.nombre}","${c.tipo}","${c.lote}","${c.finca}","${c.estado}","${c.fechaSiembra}",${c.rendimientoEstimado || ""},${c.gastosAsociados}`))
      rows.push(`\nTotal cultivos,${d.totalCultivos}`)
      rows.push(`Activos,${d.activos}`)
      rows.push(`Cosechados,${d.cosechados}`)
      return rows.join("\n")
    }
    case "costos": {
      const d = data as ReporteCostos
      const rows = ["Lote,Finca,Costo Bitácora,Costo Jornales,Costo Total,Actividades"]
      d.lotes.forEach((l) => rows.push(`"${l.lote}","${l.finca}",${l.costoBitacora},${l.costoJornales},${l.costoTotal},${l.actividades}`))
      return rows.join("\n")
    }
    case "bitacora": {
      const d = data as ReporteBitacora
      const rows = ["Actividad,Descripción,Fecha,Lote,Cultivo,Costo,Usuario"]
      d.registros.forEach((r) => rows.push(`"${r.actividad}","${r.descripcion}","${r.fecha}","${r.lote}","${r.cultivo || ""}",${r.costo},"${r.usuario}"`))
      rows.push(`\nTotal registros,${d.totalRegistros}`)
      rows.push(`Costo total,${d.costoTotal}`)
      return rows.join("\n")
    }
  }
}
