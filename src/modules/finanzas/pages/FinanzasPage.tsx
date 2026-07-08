import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { useFinanzas } from "../hooks/useFinanzas"
import { useModal } from "@/hooks/useModal"
import { finanzaService } from "../services/finanza.service"
import { useNotification } from "@/hooks/useNotification"
import { formatCurrency, formatCompactCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { CATEGORIA_GASTO_OPTIONS } from "../schemas/finanza.schema"
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react"
import { useState } from "react"

function FinanzasPage() {
  const navigate = useNavigate()
  const { gastos, ventas, summary, loading, error, refetch } = useFinanzas()
  const { notify } = useNotification()
  const deleteModal = useModal()
  const [tab, setTab] = useState<"gastos" | "ventas">("gastos")
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: "gasto" | "venta" } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === "gasto") await finanzaService.deleteGasto(deleteTarget.id)
      else await finanzaService.updateVenta(deleteTarget.id, "ANULADA")
      notify({ type: "success", title: "Eliminado", message: "Registro eliminado correctamente." })
      deleteModal.close()
      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Finanzas"
        description="Gestión de ingresos y gastos"
        actions={
          <div className="flex gap-2">
            <Link to="/app/finanzas/nuevo?tipo=gasto"><Button variant="outline"><Plus size={16} />Gasto</Button></Link>
            <Link to="/app/finanzas/nuevo?tipo=venta"><Button><ShoppingCart size={16} />Venta</Button></Link>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Summary */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><TrendingUp size={16} className="text-emerald-600" /><span className="text-xs font-medium">Ingresos del Mes</span></div>
            <p className="text-2xl font-bold text-emerald-700">{formatCompactCurrency(summary.ingresosMes)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><TrendingDown size={16} className="text-red-600" /><span className="text-xs font-medium">Gastos del Mes</span></div>
            <p className="text-2xl font-bold text-red-700">{formatCompactCurrency(summary.gastosMes)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Balance</span></div>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? "text-emerald-700" : "text-red-700"}`}>{formatCompactCurrency(summary.balance)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><ShoppingCart size={16} /><span className="text-xs font-medium">Ventas</span></div>
            <p className="text-lg text-stone-900">{summary.ventasCompletadas} completadas · {summary.ventasPendientes} pendientes</p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        <button onClick={() => setTab("gastos")} className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${tab === "gastos" ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          Gastos ({gastos.length})
        </button>
        <button onClick={() => setTab("ventas")} className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${tab === "ventas" ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          Ventas ({ventas.length})
        </button>
      </div>

      {/* Gastos List */}
      {tab === "gastos" && (
        loading ? (
          <div className="flex justify-center py-16"><p className="text-stone-400">Cargando...</p></div>
        ) : gastos.length === 0 ? (
          <EmptyState title="Sin gastos" description="No hay gastos registrados." />
        ) : (
          <div className="space-y-3">
            {gastos.map((g) => (
              <Card key={g.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/app/finanzas/${g.id}?tipo=gasto`)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-stone-900">{g.descripcion}</h3>
                      {g.categoria && <Badge>{CATEGORIA_GASTO_OPTIONS.find((c) => c.value === g.categoria)?.label || g.categoria}</Badge>}
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{formatDate(g.fecha)} · {g.lote?.nombre || g.finca?.nombre || ""}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-red-600">{formatCurrency(g.monto)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/app/finanzas/${g.id}?tipo=gasto`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 cursor-pointer"><Edit size={16} /></button>
                    <button onClick={() => { setDeleteTarget({ id: g.id, type: "gasto" }); deleteModal.open() }} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Ventas List */}
      {tab === "ventas" && (
        loading ? (
          <div className="flex justify-center py-16"><p className="text-stone-400">Cargando...</p></div>
        ) : ventas.length === 0 ? (
          <EmptyState title="Sin ventas" description="No hay ventas registradas." />
        ) : (
          <div className="space-y-3">
            {ventas.map((v) => (
              <Card key={v.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/app/finanzas/${v.id}?tipo=venta`)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-stone-900">Venta #{v.id}</h3>
                      <Badge color={v.estado === "COMPLETADA" ? "success" : v.estado === "PENDIENTE" ? "warning" : "error"}>{v.estado}</Badge>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{v.cliente?.nombre} · {formatDate(v.fecha)}</p>
                    <p className="text-xs text-stone-400">{v.detalles?.length || 0} producto(s)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-emerald-700">{formatCurrency(v.total)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/app/finanzas/${v.id}?tipo=venta`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 cursor-pointer"><Edit size={16} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      <ConfirmDialog isOpen={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title={deleteTarget?.type === "gasto" ? "Eliminar Gasto" : "Anular Venta"} message="¿Estás seguro?" loading={deleting} />
    </div>
  )
}

export default FinanzasPage
