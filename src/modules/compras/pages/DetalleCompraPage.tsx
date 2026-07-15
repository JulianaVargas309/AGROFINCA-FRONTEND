import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useCompra } from "../hooks/useCompra"
import { compraService } from "../services/compra.service"
import { useNotification } from "@/hooks/useNotification"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import type { Option } from "@/types"

const estadoOptions: Option[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "COMPLETADA", label: "Completada" },
  { value: "ANULADA", label: "Anulada" },
]

const estadoColors: Record<string, string> = {
  PENDIENTE: "warning",
  COMPLETADA: "success",
  ANULADA: "error",
}

function DetalleCompraPage() {
  const { id } = useParams<{ id: string }>()
  const { compra, loading, error, refetch } = useCompra(id ? Number(id) : null)
  const { notify } = useNotification()
  const [cambiandoEstado, setCambiandoEstado] = useState(false)

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (!compra) return
    setCambiandoEstado(true)
    try {
      await compraService.updateEstado(compra.id, { estado: nuevoEstado })
      notify({ type: "success", title: "Estado actualizado", message: "Estado de compra actualizado correctamente." })
      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo actualizar el estado." })
    } finally {
      setCambiandoEstado(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!compra) return <Alert severity="info">Compra no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Compra #${compra.id}`} description={compra.numeroFactura ? `Factura: ${compra.numeroFactura}` : "Sin factura"} actions={
        <Link to="/app/compras"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información General">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Factura</dt><dd className="dark:text-stone-100">{compra.numeroFactura || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha</dt><dd className="dark:text-stone-100">{formatDate(compra.fecha)}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Proveedor</dt><dd className="dark:text-stone-100">{compra.proveedor?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Total</dt><dd className="dark:text-stone-100">{formatCurrency(compra.total)}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Observaciones</dt><dd className="dark:text-stone-100">{compra.observaciones || "-"}</dd></div>
          </dl>
        </Card>
        <Card title="Estado">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">Estado Actual</dt>
              <dd className="mt-1"><Badge color={estadoColors[compra.estado] || "default"}>{compra.estado}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">Cambiar Estado</dt>
              <dd className="mt-1">
                <Select
                  options={estadoOptions}
                  value={compra.estado}
                  placeholder="Seleccione..."
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  disabled={cambiandoEstado}
                />
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title="Detalles de Compra" padding="none">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b dark:bg-stone-800 dark:border-stone-700">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600 dark:text-stone-300">Producto</th>
              <th className="text-right p-3 font-medium text-stone-600 dark:text-stone-300">Cantidad</th>
              <th className="text-right p-3 font-medium text-stone-600 dark:text-stone-300">Precio Unit.</th>
              <th className="text-right p-3 font-medium text-stone-600 dark:text-stone-300">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
            {compra.detalles?.map((detalle) => (
              <tr key={detalle.id} className="hover:bg-stone-50 dark:hover:bg-stone-800">
                <td className="p-3 dark:text-stone-100">{detalle.producto?.nombre || `Producto #${detalle.productoId}`}</td>
                <td className="p-3 text-right dark:text-stone-100">{detalle.cantidad}</td>
                <td className="p-3 text-right dark:text-stone-100">{formatCurrency(detalle.precioUnitario)}</td>
                <td className="p-3 text-right font-medium dark:text-stone-100">{formatCurrency(detalle.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-stone-200 dark:border-stone-700">
            <tr>
              <td colSpan={3} className="p-3 text-right font-bold dark:text-stone-100">Total</td>
              <td className="p-3 text-right dark:text-stone-100">{formatCurrency(compra.total)}</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  )
}

export default DetalleCompraPage
