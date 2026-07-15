import { Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Pagination } from "@/components/ui/Pagination"
import { Spinner } from "@/components/ui/Spinner"
import { useNotificaciones } from "../hooks/useNotificaciones"
import { formatDate } from "@/utils/formatDate"
import { Bell, CheckCheck, Trash2, Mail, MailOpen, ExternalLink } from "lucide-react"
import type { Option } from "@/types"
import { useState } from "react"

const filtroOptions: Option[] = [
  { value: "", label: "Todas" },
  { value: "noLeidas", label: "No leídas" },
  { value: "leidas", label: "Leídas" },
]

function NotificacionesPage() {
  const {
    notificaciones, loading, error, pagination, noLeidasCount,
    filtroLeida, setFiltroLeida, setPage,
    handleMarcarLeida, handleMarcarTodasLeidas, handleEliminar, refetch,
  } = useNotificaciones()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Notificaciones"
        description="Centro de notificaciones y alertas"
        actions={
          <div className="flex items-center gap-2">
            {noLeidasCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarcarTodasLeidas}>
                <CheckCheck size={14} />Marcar todas leídas
              </Button>
            )}
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Badge count */}
      <div className="flex items-center gap-2">
        <Bell size={20} className="text-stone-500" />
        <span className="text-sm text-stone-600">
          {noLeidasCount > 0
            ? `Tienes ${noLeidasCount} notificaciones sin leer`
            : "No hay notificaciones sin leer"}
        </span>
        {noLeidasCount > 0 && (
          <Badge color="error">{noLeidasCount}</Badge>
        )}
      </div>

      {/* Filter */}
      <div className="w-48">
        <select
          value={filtroLeida}
          onChange={(e) => setFiltroLeida(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white text-stone-700"
        >
          {filtroOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <Spinner />
      ) : notificaciones.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <Bell size={40} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-stone-500">
              {filtroLeida ? "No hay notificaciones con ese filtro." : "No hay notificaciones."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {notificaciones.map((notif) => (
            <Card key={notif.id} className={`hover:shadow-sm transition-shadow ${!notif.leida ? "border-emerald-200 bg-emerald-50/30" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${!notif.leida ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                  {!notif.leida ? <Mail size={18} /> : <MailOpen size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.leida ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                        {notif.titulo}
                      </p>
                      {notif.mensaje && (
                        <p className="text-xs text-stone-500 mt-1">{notif.mensaje}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {notif.link && (
                        <Link to={notif.link} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
                          <ExternalLink size={14} />
                        </Link>
                      )}
                      {!notif.leida && (
                        <button
                          onClick={() => handleMarcarLeida(notif.id)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer"
                          title="Marcar como leída"
                        >
                          <CheckCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(notif.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{formatDate(notif.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default NotificacionesPage
