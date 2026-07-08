import { useConfiguracion } from "../hooks/useConfiguracion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sun, Moon, Globe, Bell } from "lucide-react"

function ConfiguracionForm() {
  const { config, updateConfig } = useConfiguracion()

  return (
    <div className="space-y-6">
      {/* Tema */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              {config.tema === "oscuro" ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Tema</h3>
              <p className="text-xs text-stone-500">Cambia la apariencia de la aplicación</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateConfig({ tema: "claro" })}
              className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer transition-colors ${config.tema === "claro" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}
            >
              <Sun size={14} className="inline mr-1" />Claro
            </button>
            <button
              onClick={() => updateConfig({ tema: "oscuro" })}
              className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer transition-colors ${config.tema === "oscuro" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}
            >
              <Moon size={14} className="inline mr-1" />Oscuro
            </button>
          </div>
        </div>
      </Card>

      {/* Idioma */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Idioma</h3>
              <p className="text-xs text-stone-500">Selecciona el idioma de la interfaz</p>
            </div>
          </div>
          <select
            value={config.idioma}
            onChange={(e) => updateConfig({ idioma: e.target.value })}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 cursor-pointer"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </Card>

      {/* Notificaciones */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Notificaciones</h3>
              <p className="text-xs text-stone-500">Activa o desactiva las notificaciones del sistema</p>
            </div>
          </div>
          <button
            onClick={() => updateConfig({ notificaciones: !config.notificaciones })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${config.notificaciones ? "bg-emerald-600" : "bg-stone-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.notificaciones ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </Card>

      {/* Sistema */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Información del Sistema</h3>
            <p className="text-xs text-stone-500">Versión y detalles técnicos</p>
          </div>
          <div className="text-right">
            <Badge>{import.meta.env.VITE_APP_VERSION || "1.0.0"}</Badge>
            <p className="text-xs text-stone-400 mt-1">{import.meta.env.VITE_APP_NAME || "AgroFinca Familiar"}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { ConfiguracionForm }
