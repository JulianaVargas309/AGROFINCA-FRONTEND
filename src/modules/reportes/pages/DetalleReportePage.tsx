import { useLocation, useParams, Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { REPORT_TYPES } from "../types/reporte.types"
import type { ReportType } from "../types/reporte.types"
import type {
  ReporteInventario,
  ReporteFinanciero,
  ReporteProduccion,
  ReporteCostos,
  ReporteBitacora,
} from "../types/reporte.types"
import { ArrowLeft, BarChart3, FileDown, Printer } from "lucide-react"
import { useReportes } from "../hooks/useReportes"

function DetalleReportePage() {
  const { id: reportTypeParam } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const stateData = location.state as { data: unknown; tipo: ReportType } | null

  const { exportCSV } = useReportes()

  if (!stateData?.data || !stateData?.tipo) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <PageHeader
          title="Detalle del Reporte"
          description="Selecciona un reporte desde la lista"
          actions={
            <Link to="/app/reportes">
              <Button variant="outline"><ArrowLeft size={16} />Volver</Button>
            </Link>
          }
        />
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="Reporte no encontrado"
          description="Genera un reporte desde la sección de reportes para ver su detalle."
          action={
            <Button onClick={() => navigate("/app/reportes/nuevo")}>Generar Reporte</Button>
          }
        />
      </div>
    )
  }

  const { data, tipo } = stateData
  const label = REPORT_TYPES.find((r) => r.value === tipo)?.label || tipo

  const handleExportCSV = () => {
    if (!data || !tipo) return
    const csv = convertToCSV(tipo, data as ReportData)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte_${tipo}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={`Reporte: ${label}`}
        description={`Generado el ${formatDate(new Date())}`}
        actions={
          <div className="flex gap-2">
            <Link to="/app/reportes">
              <Button variant="outline"><ArrowLeft size={16} />Volver</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileDown size={14} />CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={14} />PDF
            </Button>
          </div>
        }
      />
      <div className="space-y-4" id="report-content">
        {tipo === "inventario" && <ReporteInventarioView data={data as ReporteInventario} />}
        {tipo === "financiero" && <ReporteFinancieroView data={data as ReporteFinanciero} />}
        {tipo === "produccion" && <ReporteProduccionView data={data as ReporteProduccion} />}
        {tipo === "costos" && <ReporteCostosView data={data as ReporteCostos} />}
        {tipo === "bitacora" && <ReporteBitacoraView data={data as ReporteBitacora} />}
      </div>
    </div>
  )
}

type ReportData = ReporteInventario | ReporteFinanciero | ReporteProduccion | ReporteCostos | ReporteBitacora

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

function ReporteInventarioView({ data }: { data: ReporteInventario }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Productos</p><p className="text-xl font-bold">{data.totalProductos}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Valor Inventario</p><p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(data.valorInventario)}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Stock Bajo</p><p className="text-xl font-bold text-red-600 dark:text-red-400">{data.stockBajo}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Producto</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Cat.</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Stock</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Mín</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Precio</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Valor</th>
            </tr></thead>
            <tbody>
              {data.productos.map((p, i) => (
                <tr key={i} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400">{p.categoria}</td>
                  <td className={`px-4 py-2 text-right ${p.stockActual <= p.stockMinimo ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>{p.stockActual} {p.unidadMedida}</td>
                  <td className="px-4 py-2 text-right text-stone-500 dark:text-stone-400">{p.stockMinimo}</td>
                  <td className="px-4 py-2 text-right">{p.precioUnitario ? formatCurrency(p.precioUnitario) : "-"}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.valorTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function ReporteFinancieroView({ data }: { data: ReporteFinanciero }) {
  const balance = data.totalIngresos - data.totalGastos
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Ingresos totales</p><p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(data.totalIngresos)}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Gastos totales</p><p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.totalGastos)}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Balance</p><p className={`text-xl font-bold ${balance >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>{formatCurrency(balance)}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Mes</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Ingresos</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Gastos</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Balance</th>
            </tr></thead>
            <tbody>
              {data.ingresos.map((ing, i) => {
                const gasto = data.gastos[i]?.total || 0
                const bal = ing.total - gasto
                return (
                  <tr key={ing.mes} className="border-b border-stone-100 dark:border-stone-800">
                    <td className="px-4 py-2">{ing.mes}</td>
                    <td className="px-4 py-2 text-right text-emerald-700 dark:text-emerald-300">{formatCurrency(ing.total)}</td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">{formatCurrency(gasto)}</td>
                    <td className={`px-4 py-2 text-right font-medium ${bal >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>{formatCurrency(bal)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function ReporteProduccionView({ data }: { data: ReporteProduccion }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Total cultivos</p><p className="text-xl font-bold">{data.totalCultivos}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Activos</p><p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{data.activos}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Cosechados</p><p className="text-xl font-bold text-amber-600 dark:text-amber-400">{data.cosechados}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Cultivo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Tipo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Lote</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Finca</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Estado</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Siembra</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Gastos</th>
            </tr></thead>
            <tbody>
              {data.cultivos.map((c, i) => (
                <tr key={i} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-4 py-2 font-medium">{c.nombre}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400">{c.tipo}</td>
                  <td className="px-4 py-2">{c.lote}</td>
                  <td className="px-4 py-2">{c.finca}</td>
                  <td className="px-4 py-2"><Badge color={c.estado === "ACTIVO" ? "success" : c.estado === "COSECHADO" ? "info" : "error"}>{c.estado}</Badge></td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400">{formatDate(c.fechaSiembra)}</td>
                  <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">{formatCurrency(c.gastosAsociados)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function ReporteCostosView({ data }: { data: ReporteCostos }) {
  const total = data.lotes.reduce((s, l) => s + l.costoTotal, 0)
  return (
    <>
      <Card><p className="text-xs text-stone-500 dark:text-stone-400">Costo total todas las operaciones</p><p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(total)}</p></Card>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Lote</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Finca</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Costo Bitácora</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Costo Jornales</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Costo Total</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Actividades</th>
            </tr></thead>
            <tbody>
              {data.lotes.map((l) => (
                <tr key={l.lote} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-4 py-2 font-medium">{l.lote}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400">{l.finca}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(l.costoBitacora)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(l.costoJornales)}</td>
                  <td className="px-4 py-2 text-right font-bold text-red-600 dark:text-red-400">{formatCurrency(l.costoTotal)}</td>
                  <td className="px-4 py-2 text-right">{l.actividades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function ReporteBitacoraView({ data }: { data: ReporteBitacora }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Total registros</p><p className="text-xl font-bold">{data.totalRegistros}</p></Card>
        <Card><p className="text-xs text-stone-500 dark:text-stone-400">Costo total</p><p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.costoTotal)}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 sticky top-0">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Actividad</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Descripción</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Lote</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600 dark:text-stone-300">Costo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600 dark:text-stone-300">Usuario</th>
            </tr></thead>
            <tbody>
              {data.registros.map((r, i) => (
                <tr key={i} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-4 py-2">{r.actividad}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400 max-w-[200px] truncate">{r.descripcion}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400 text-xs">{formatDate(r.fecha)}</td>
                  <td className="px-4 py-2">{r.lote}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(r.costo)}</td>
                  <td className="px-4 py-2 text-stone-500 dark:text-stone-400">{r.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default DetalleReportePage
