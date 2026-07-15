import { Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { useCajas } from "../hooks/useCajas"
import type { Caja } from "../types/caja.types"
import { formatCurrency } from "@/utils/formatCurrency"
import { Plus, Wallet, Eye } from "lucide-react"

function CajasPage() {
  const { cajas, loading, error } = useCajas()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Cajas" description="Administración de cajas y saldos" actions={
        <Link to="/app/caja/nueva"><Button><Plus size={16} />Nueva Caja</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><div className="animate-pulse space-y-3"><div className="h-4 w-24 rounded bg-stone-100" /><div className="h-8 w-32 rounded bg-stone-100" /></div></Card>
          ))}
        </div>
      ) : cajas.length === 0 ? (
        <Card><div className="py-12 text-center"><Wallet size={40} className="mx-auto text-stone-300" /><p className="mt-3 text-sm text-stone-500">No hay cajas registradas.</p></div></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cajas.map((caja: Caja) => (
            <Card key={caja.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-stone-800">{caja.nombre}</h3>
                  {caja.descripcion && <p className="text-xs text-stone-500 mt-1">{caja.descripcion}</p>}
                  <p className="mt-3 text-2xl font-bold text-emerald-700">{formatCurrency(caja.saldoActual)}</p>
                  <p className="text-xs text-stone-400">Saldo actual</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Wallet size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <Link to={`/app/caja/${caja.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  <Eye size={14} />Ver movimientos
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CajasPage
