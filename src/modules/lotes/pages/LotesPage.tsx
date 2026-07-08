import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Select } from "@/components/ui/Select"
import { SearchBar } from "@/components/shared/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useLotes } from "../hooks/useLotes"
import { useModal } from "@/hooks/useModal"
import { loteService } from "../services/lote.service"
import { useNotification } from "@/hooks/useNotification"
import type { Lote } from "../types/lote.types"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Lote>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/lotes/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.nombre}
      </Link>
    ),
  },
  {
    key: "area",
    header: "Área",
    render: (item) => (item.area ? `${item.area} ha` : "-"),
  },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} nombre={item.nombre} onDeleted={() => window.location.reload()} />,
  },
]

function Actions({ id, nombre, onDeleted }: { id: number; nombre: string; onDeleted: () => void }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await loteService.remove(id)
      notify({ type: "success", title: "Lote eliminado", message: `"${nombre}" fue desactivado.` })
      confirmModal.close()
      onDeleted()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar el lote." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/lotes/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Lote"
        message={`¿Eliminar "${nombre}"? Será desactivado.`}
        loading={deleting}
      />
    </div>
  )
}

function LotesPage() {
  const { lotes, fincas, fincaSeleccionada, loading, error, search, setSearch, setFinca } = useLotes()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Lotes"
        description="Gestiona los lotes por finca"
        actions={
          <Link to="/app/lotes/nuevo">
            <Button><Plus size={16} />Nuevo Lote</Button>
          </Link>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          options={fincas.map((f) => ({ value: String(f.id), label: f.nombre }))}
          value={fincaSeleccionada ? String(fincaSeleccionada) : ""}
          onChange={(e) => setFinca(Number(e.target.value))}
          placeholder="Selecciona una finca"
          className="min-w-[220px]"
        />
        <div className="flex-1 max-w-sm">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar lotes..." />
        </div>
      </div>

      <Card padding="none">
        <DataTable
          columns={columns}
          data={lotes}
          loading={loading}
          emptyMessage={fincaSeleccionada ? "No hay lotes en esta finca." : "Selecciona una finca para ver sus lotes."}
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

export default LotesPage
