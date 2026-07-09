import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useJornales } from "../hooks/useJornales"
import { useModal } from "@/hooks/useModal"
import { jornalService } from "../services/jornal.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Jornal } from "../types/jornal.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Jornal>[] = [
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  {
    key: "trabajador",
    header: "Trabajador",
    render: (item) => item.trabajador?.nombre || "-",
  },
  { key: "horas", header: "Horas" },
  { key: "valorHora", header: "Valor Hora", render: (item) => formatCurrency(item.valorHora) },
  { key: "total", header: "Total", render: (item) => <span className="font-medium">{formatCurrency(item.total)}</span> },
  { key: "lote", header: "Lote", render: (item) => item.lote?.nombre || "-" },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} />,
  },
]

function Actions({ id }: { id: number }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await jornalService.remove(id)
      notify({ type: "success", title: "Jornal eliminado", message: "Jornal eliminado correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/jornales/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Jornal" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

function JornalesPage() {
  const { jornales, loading, error, pagination, search, setSearch, setPage } = useJornales()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Jornales" description="Registro de jornales y salarios" actions={
        <Link to="/app/jornales/nuevo"><Button><Plus size={16} />Nuevo Jornal</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar por trabajador..." /></div>
      <Card padding="none">
        <DataTable columns={columns} data={jornales} loading={loading} emptyMessage="No hay jornales registrados." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default JornalesPage
