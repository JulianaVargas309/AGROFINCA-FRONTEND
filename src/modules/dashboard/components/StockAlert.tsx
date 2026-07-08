import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Package, AlertTriangle } from "lucide-react"
import type { ProductoStockBajo } from "../types/dashboard.types"

interface StockAlertProps {
  productos: ProductoStockBajo[]
  loading?: boolean
}

export function StockAlert({ productos, loading }: StockAlertProps) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-stone-200" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-32 rounded bg-stone-100" />
              <div className="h-3 w-16 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-stone-700">Alertas de Stock Bajo</h3>
        {productos.length > 0 && (
          <Badge color="error" className="ml-auto">{productos.length}</Badge>
        )}
      </div>
      {productos.length === 0 ? (
        <div className="py-4 text-center">
          <Package size={28} className="mx-auto text-stone-300" />
          <p className="mt-2 text-xs text-stone-500">Todo el inventario tiene stock suficiente.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {productos.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-red-800">{p.nombre}</p>
                <p className="text-xs text-red-600">
                  Stock: {p.stockActual} / Mín: {p.stockMinimo} {p.unidadMedida}
                </p>
              </div>
              <Badge color="error">Bajo</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
