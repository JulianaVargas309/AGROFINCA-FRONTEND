import { Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useRendimientos } from "../hooks/useRendimientos"
import type { RendimientoLote, RendimientoCultivo } from "../types/rendimiento.types"
import { Plus, LayoutGrid, Sprout } from "lucide-react"

const loteColumns: Column<RendimientoLote>[] = [
  { key: "lote", header: "Lote", render: (item) => item.lote?.nombre || "-" },
  { key: "temporada", header: "Temporada", render: (item) => item.temporada || "-" },
  {
    key: "areaCultivada",
    header: "Área (ha)",
    render: (item) => (item.areaCultivada ? `${item.areaCultivada}` : "-"),
  },
  {
    key: "produccionTotal",
    header: "Producción Total",
    render: (item) => `${item.produccionTotal} ${item.unidad || ""}`,
  },
  {
    key: "rendimiento",
    header: "Rendimiento",
    render: (item) => (item.rendimiento ? `${item.rendimiento} ${item.unidad}/ha` : "-"),
  },
]

const cultivoColumns: Column<RendimientoCultivo>[] = [
  { key: "cultivo", header: "Cultivo", render: (item) => item.cultivo?.nombre || "-" },
  { key: "temporada", header: "Temporada", render: (item) => item.temporada || "-" },
  {
    key: "areaCultivada",
    header: "Área (ha)",
    render: (item) => (item.areaCultivada ? `${item.areaCultivada}` : "-"),
  },
  {
    key: "produccionTotal",
    header: "Producción Total",
    render: (item) => `${item.produccionTotal} ${item.unidad || ""}`,
  },
  {
    key: "rendimiento",
    header: "Rendimiento",
    render: (item) => (item.rendimiento ? `${item.rendimiento} ${item.unidad}/ha` : "-"),
  },
]

function RendimientoPage() {
  const { lotes, cultivos, loading, error, activeTab, setActiveTab } = useRendimientos()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Rendimiento"
        description="Rendimiento de lotes y cultivos"
        actions={
          <Link to={activeTab === "lotes" ? "#" : "#"}>
            <Button>
              <Plus size={16} />
              {activeTab === "lotes" ? "Nuevo Rendimiento de Lote" : "Nuevo Rendimiento de Cultivo"}
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("lotes")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "lotes"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <LayoutGrid size={16} />
          Por Lote
        </button>
        <button
          onClick={() => setActiveTab("cultivos")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "cultivos"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <Sprout size={16} />
          Por Cultivo
        </button>
      </div>

      {activeTab === "lotes" ? (
        <Card padding="none">
          <DataTable columns={loteColumns} data={lotes} loading={loading} emptyMessage="No hay rendimientos por lote." keyExtractor={(item) => item.id} />
        </Card>
      ) : (
        <Card padding="none">
          <DataTable columns={cultivoColumns} data={cultivos} loading={loading} emptyMessage="No hay rendimientos por cultivo." keyExtractor={(item) => item.id} />
        </Card>
      )}
    </div>
  )
}

export default RendimientoPage
