import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { useConfiguracion } from "../hooks/useConfiguracion"
import { configuracionService } from "../services/configuracion.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { Save, X } from "lucide-react"

function ConfiguracionPage() {
  const { configs, loading, error, refetch } = useConfiguracion()
  const { notify } = useNotification()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)

  const startEdit = (config: { id: number; valor: string }) => {
    setEditingId(config.id)
    setEditValue(config.valor)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleSave = async (config: { id: number; llave: string }) => {
    setSaving(true)
    try {
      await configuracionService.upsert(config.llave, { valor: editValue })
      notify({ type: "success", title: "Configuración actualizada", message: "Valor guardado correctamente." })
      setEditingId(null)
      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo actualizar la configuración." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Configuración del Sistema"
        description="Ajustes y parámetros del sistema"
      />
      <div className="space-y-3">
        {configs.map((config) => (
          <Card key={config.id}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-stone-900">{config.llave}</h3>
                <p className="text-xs text-stone-500">{config.descripcion || "Sin descripción"}</p>
                <Badge className="mt-1">{config.tipo}</Badge>
              </div>
              <div className="flex items-center gap-2 shrink-0 max-w-[300px]">
                {editingId === config.id ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="min-w-[200px]"
                    />
                    <Button size="sm" onClick={() => handleSave(config)} disabled={saving}>
                      <Save size={14} />
                    </Button>
                    <button onClick={cancelEdit} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 cursor-pointer">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-stone-700 truncate">{config.valor}</span>
                    <Button variant="outline" size="sm" onClick={() => startEdit(config)}>
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
        {configs.length === 0 && (
          <Alert severity="info">No hay configuraciones disponibles.</Alert>
        )}
      </div>
    </div>
  )
}

export default ConfiguracionPage
