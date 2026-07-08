import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { useReportes } from "../hooks/useReportes"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { REPORT_TYPES, type ReportType } from "../types/reporte.types"
import type {
  ReporteInventario,
  ReporteFinanciero,
  ReporteProduccion,
  ReporteCostos,
  ReporteBitacora,
} from "../types/reporte.types"
import { BarChart3, FileDown, Printer } from "lucide-react"
import { cn } from "@/utils/cn"

function ReportesPage() {
  const { data, loading, error, reportType, generate, exportCSV, exportPDF } = useReportes()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Reportes"
        description="Genera y exporta reportes de tu finca"
        actions={
          data && reportType ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <FileDown size={14} />CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF}>
                <Printer size={14} />PDF
              </Button>
            </div>
          ) : null
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Report Type Selector */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.value}
            onClick={() => generate(rt.value)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all cursor-pointer",
              reportType === rt.value
                ? "border-emerald-400 bg-emerald-50 shadow-sm"
                : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
            )}
          >
            <p className="text-sm font-semibold text-stone-900">{rt.label}</p>
            <p className="text-xs text-stone-500 mt-1">{rt.description}</p>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      )}

      {/* No report selected */}
      {!data && !loading && (
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="Selecciona un reporte"
          description="Elige un tipo de reporte para generar y visualizar los datos."
        />
      )}

      {/* Content area with print-friendly style */}
      {data && reportType && (
        <div id="report-content" className="space-y-4 print:space-y-2">
          <ReportHeader type={reportType} data={data} />

          {reportType === "inventario" && <ReporteInventarioView data={data as ReporteInventario} />}
          {reportType === "financiero" && <ReporteFinancieroView data={data as ReporteFinanciero} />}
          {reportType === "produccion" && <ReporteProduccionView data={data as ReporteProduccion} />}
          {reportType === "costos" && <ReporteCostosView data={data as ReporteCostos} />}
          {reportType === "bitacora" && <ReporteBitacoraView data={data as ReporteBitacora} />}
        </div>
      )}
    </div>
  )
}

function ReportHeader({ type }: { type: ReportType; data: unknown }) {
  const label = REPORT_TYPES.find((r) => r.value === type)?.label || type
  return (
    <div className="print:hidden">
      <h2 className="text-lg font-bold text-stone-900">Reporte: {label}</h2>
      <p className="text-xs text-stone-400">Generado: {formatDate(new Date())}</p>
    </div>
  )
}

function ReporteInventarioView({ data }: { data: ReporteInventario }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-stone-500">Productos</p><p className="text-xl font-bold">{data.totalProductos}</p></Card>
        <Card><p className="text-xs text-stone-500">Valor Inventario</p><p className="text-xl font-bold text-emerald-700">{formatCurrency(data.valorInventario)}</p></Card>
        <Card><p className="text-xs text-stone-500">Stock Bajo</p><p className="text-xl font-bold text-red-600">{data.stockBajo}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Producto</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Cat.</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Stock</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Mín</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Precio</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Valor</th>
            </tr></thead>
            <tbody>
              {data.productos.map((p) => (
                <tr key={p.nombre} className="border-b border-stone-100">
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2 text-stone-500">{p.categoria}</td>
                  <td className={`px-4 py-2 text-right ${p.stockActual <= p.stockMinimo ? "text-red-600 font-medium" : ""}`}>{p.stockActual} {p.unidadMedida}</td>
                  <td className="px-4 py-2 text-right text-stone-500">{p.stockMinimo}</td>
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
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-stone-500">Ingresos totales</p><p className="text-xl font-bold text-emerald-700">{formatCurrency(data.totalIngresos)}</p></Card>
        <Card><p className="text-xs text-stone-500">Gastos totales</p><p className="text-xl font-bold text-red-600">{formatCurrency(data.totalGastos)}</p></Card>
        <Card><p className="text-xs text-stone-500">Balance</p><p className={`text-xl font-bold ${data.totalIngresos - data.totalGastos >= 0 ? "text-emerald-700" : "text-red-700"}`}>{formatCurrency(data.totalIngresos - data.totalGastos)}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Mes</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Ingresos</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Gastos</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Balance</th>
            </tr></thead>
            <tbody>
              {data.ingresos.map((ing, i) => {
                const gasto = data.gastos[i]?.total || 0
                const bal = ing.total - gasto
                return (
                  <tr key={ing.mes} className="border-b border-stone-100">
                    <td className="px-4 py-2">{ing.mes}</td>
                    <td className="px-4 py-2 text-right text-emerald-700">{formatCurrency(ing.total)}</td>
                    <td className="px-4 py-2 text-right text-red-600">{formatCurrency(gasto)}</td>
                    <td className={`px-4 py-2 text-right font-medium ${bal >= 0 ? "text-emerald-700" : "text-red-700"}`}>{formatCurrency(bal)}</td>
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
        <Card><p className="text-xs text-stone-500">Total cultivos</p><p className="text-xl font-bold">{data.totalCultivos}</p></Card>
        <Card><p className="text-xs text-stone-500">Activos</p><p className="text-xl font-bold text-emerald-700">{data.activos}</p></Card>
        <Card><p className="text-xs text-stone-500">Cosechados</p><p className="text-xl font-bold text-amber-600">{data.cosechados}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Cultivo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Tipo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Lote</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Finca</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Estado</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Siembra</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Gastos</th>
            </tr></thead>
            <tbody>
              {data.cultivos.map((c, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="px-4 py-2 font-medium">{c.nombre}</td>
                  <td className="px-4 py-2 text-stone-500">{c.tipo}</td>
                  <td className="px-4 py-2">{c.lote}</td>
                  <td className="px-4 py-2">{c.finca}</td>
                  <td className="px-4 py-2"><Badge color={c.estado === "ACTIVO" ? "success" : c.estado === "COSECHADO" ? "info" : "error"}>{c.estado}</Badge></td>
                  <td className="px-4 py-2 text-stone-500">{formatDate(c.fechaSiembra)}</td>
                  <td className="px-4 py-2 text-right text-red-600">{formatCurrency(c.gastosAsociados)}</td>
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
      <Card><p className="text-xs text-stone-500">Costo total todas las operaciones</p><p className="text-2xl font-bold text-red-600">{formatCurrency(total)}</p></Card>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Lote</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Finca</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Costo Bitácora</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Costo Jornales</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Costo Total</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Actividades</th>
            </tr></thead>
            <tbody>
              {data.lotes.map((l) => (
                <tr key={l.lote} className="border-b border-stone-100">
                  <td className="px-4 py-2 font-medium">{l.lote}</td>
                  <td className="px-4 py-2 text-stone-500">{l.finca}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(l.costoBitacora)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(l.costoJornales)}</td>
                  <td className="px-4 py-2 text-right font-bold text-red-600">{formatCurrency(l.costoTotal)}</td>
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
        <Card><p className="text-xs text-stone-500">Total registros</p><p className="text-xl font-bold">{data.totalRegistros}</p></Card>
        <Card><p className="text-xs text-stone-500">Costo total</p><p className="text-xl font-bold text-red-600">{formatCurrency(data.costoTotal)}</p></Card>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 bg-stone-50 sticky top-0">
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Actividad</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Descripción</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Lote</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-stone-600">Costo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-stone-600">Usuario</th>
            </tr></thead>
            <tbody>
              {data.registros.map((r, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="px-4 py-2">{r.actividad}</td>
                  <td className="px-4 py-2 text-stone-500 max-w-[200px] truncate">{r.descripcion}</td>
                  <td className="px-4 py-2 text-stone-500 text-xs">{formatDate(r.fecha)}</td>
                  <td className="px-4 py-2">{r.lote}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(r.costo)}</td>
                  <td className="px-4 py-2 text-stone-500">{r.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default ReportesPage
