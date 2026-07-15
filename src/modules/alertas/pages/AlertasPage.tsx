import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { useAlertas } from "../hooks/useAlertas"
import { alertaService } from "../services/alerta.service"
import { useNotification } from "@/hooks/useNotification"
import type { Alerta } from "../types/alertas.types"
import { formatDate } from "@/utils/formatDate"
import { RefreshCw, Bell, BellOff } from "lucide-react"
import { useState } from "react"

function AlertasPage() {
  const { alertas, loading, error, leidaFilter, setLeidaFilter, refetch } = useAlertas()
  const { notify } = useNotification()
  const [marcando, setMarcando] = useState<number | null>(null)
  const [generando, setGenerando] = useState(false)

  const handleMarcarLeida = async (id: number) => {
    setMarcando(id)
    try {
      await alertaService.marcarLeida(id)
      notify({ type: "success", title: "Alerta leída", message: "Alerta marcada como leída." })
      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo marcar la alerta." })
    } finally {
      setMarcando(null)
    }
  }

  const handleGenerar = async () => {
    setGenerando(true)
    try {
      await alertaService.generarAlertas()
      notify({ type: "success", title: "Alertas generadas", message: "Alertas generadas correctamente." })
      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudieron generar alertas." })
    } finally {
      setGenerando(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Alertas de Inventario" description="Alertas de stock bajo y vencimientos" actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLeidaFilter(leidaFilter === undefined ? false : undefined)}>
            {leidaFilter === false ? <BellOff size={16} /> : <Bell size={16} />}
            {leidaFilter === false ? "Mostrar Todas" : "No Leídas"}
          </Button>
          <Button onClick={handleGenerar} disabled={generando}>
            <RefreshCw size={16} />{generando ? "Generando..." : "Generar Alertas"}
          </Button>
        </div>
      } />
      <Card padding="none">
        {alertas.length === 0 ? (
          <div className="p-6 text-center text-stone-500">No hay alertas registradas.</div>
        ) : (
          <div className="divide-y">
            {alertas.map((alerta) => (
              <AlertaItem key={alerta.id} alerta={alerta} onMarcarLeida={handleMarcarLeida} marcando={marcando === alerta.id} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function AlertaItem({ alerta, onMarcarLeida, marcando }: { alerta: Alerta; onMarcarLeida: (id: number) => void; marcando: boolean }) {
  const tipoColors: Record<string, string> = {
    STOCK_BAJO: "warning",
    VENCIMIENTO: "error",
    INFORMATIVA: "info",
  }

  return (
    <div className={`p-4 flex items-start justify-between gap-4 ${!alerta.leida ? "bg-yellow-50" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge color={tipoColors[alerta.tipo] || "default"}>{alerta.tipo}</Badge>
          {!alerta.leida && <span className="text-xs font-medium text-yellow-700">Nueva</span>}
        </div>
        <p className="text-sm text-stone-800">{alerta.mensaje}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
          <span>{alerta.producto?.nombre || "-"}</span>
          <span>{formatDate(alerta.createdAt)}</span>
        </div>
      </div>
      {!alerta.leida && (
        <Button variant="outline" size="sm" onClick={() => onMarcarLeida(alerta.id)} disabled={marcando}>
          {marcando ? "..." : "Marcar Leída"}
        </Button>
      )}
    </div>
  )
}

export default AlertasPage
