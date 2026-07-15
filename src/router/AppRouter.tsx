import { createBrowserRouter, Navigate } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"
import { PublicRoute } from "./PublicRoute"
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import { NotFoundPage, ForbiddenPage, ServerErrorPage } from "@/pages"

import { lazy, Suspense } from "react"
import { LoadingPage } from "@/components/shared/LoadingPage"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"

const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/modules/auth/pages/RegisterPage"))
const RecuperarPasswordPage = lazy(() => import("@/modules/auth/pages/RecuperarPasswordPage"))
const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage"))
const FincasPage = lazy(() => import("@/modules/fincas/pages/FincasPage"))
const NuevaFincaPage = lazy(() => import("@/modules/fincas/pages/NuevaFincaPage"))
const DetalleFincaPage = lazy(() => import("@/modules/fincas/pages/DetalleFincaPage"))
const LotesPage = lazy(() => import("@/modules/lotes/pages/LotesPage"))
const NuevoLotePage = lazy(() => import("@/modules/lotes/pages/NuevoLotePage"))
const DetalleLotePage = lazy(() => import("@/modules/lotes/pages/DetalleLotePage"))
const CultivosPage = lazy(() => import("@/modules/cultivos/pages/CultivosPage"))
const NuevoCultivoPage = lazy(() => import("@/modules/cultivos/pages/NuevoCultivoPage"))
const DetalleCultivoPage = lazy(() => import("@/modules/cultivos/pages/DetalleCultivoPage"))
const InventarioPage = lazy(() => import("@/modules/inventario/pages/InventarioPage"))
const NuevoInventarioPage = lazy(() => import("@/modules/inventario/pages/NuevoInventarioPage"))
const DetalleInventariopage = lazy(() => import("@/modules/inventario/pages/DetalleInventariopage"))
const MovimientosPage = lazy(() => import("@/modules/movimientos/pages/MovimientosPage"))
const NuevoMovimientoPage = lazy(() => import("@/modules/movimientos/pages/NuevoMovimientoPage"))
const DetalleMovimientoPage = lazy(() => import("@/modules/movimientos/pages/DetalleMovimientoPage"))
const BitacoraPage = lazy(() => import("@/modules/bitacora/pages/BitacoraPage"))
const NuevaBitacoraPage = lazy(() => import("@/modules/bitacora/pages/NuevaBitacoraPage"))
const DetalleBitacoraPage = lazy(() => import("@/modules/bitacora/pages/DetalleBitacoraPage"))
const TrabajadoresPage = lazy(() => import("@/modules/trabajadores/pages/TrabajadoresPage"))
const NuevoTrabajadorPage = lazy(() => import("@/modules/trabajadores/pages/NuevoTrabajadorPage"))
const DetalleTrabajadorPage = lazy(() => import("@/modules/trabajadores/pages/DetalleTrabajadorPage"))
const JornalesPage = lazy(() => import("@/modules/jornales/pages/JornalesPage"))
const NuevoJornalPage = lazy(() => import("@/modules/jornales/pages/NuevoJornalPage"))
const DetalleJornalPage = lazy(() => import("@/modules/jornales/pages/DetalleJornalPage"))
const VentasPage = lazy(() => import("@/modules/ventas/pages/VentasPage"))
const NuevaVentaPage = lazy(() => import("@/modules/ventas/pages/NuevaVentaPage"))
const DetalleVentaPage = lazy(() => import("@/modules/ventas/pages/DetalleVentaPage"))
const GastosPage = lazy(() => import("@/modules/gastos/pages/GastosPage"))
const NuevoGastoPage = lazy(() => import("@/modules/gastos/pages/NuevoGastoPage"))
const DetalleGastoPage = lazy(() => import("@/modules/gastos/pages/DetalleGastoPage"))
const FinanzasPage = lazy(() => import("@/modules/finanzas/pages/FinanzasPage"))
const NuevaFinanzapage = lazy(() => import("@/modules/finanzas/pages/NuevaFinanzapage"))
const DetalleFinanzaPage = lazy(() => import("@/modules/finanzas/pages/DetalleFinanzaPage"))
const ReportesPage = lazy(() => import("@/modules/reportes/pages/ReportesPage"))
const NuevoReportePage = lazy(() => import("@/modules/reportes/pages/NuevoReportePage"))
const DetalleReportePage = lazy(() => import("@/modules/reportes/pages/DetalleReportePage"))
const UsersPage = lazy(() => import("@/modules/users/pages/UsersPage"))
const CreateUserPage = lazy(() => import("@/modules/users/pages/CreateUserPage"))
const EditUserPage = lazy(() => import("@/modules/users/pages/EditUserPage"))
const UserProfilePage = lazy(() => import("@/modules/users/pages/UserProfilePage"))
const RolesPage = lazy(() => import("@/modules/roles/pages/RolesPage"))
const PermisosPage = lazy(() => import("@/modules/permisos/pages/PermisosPage"))
const AuditoriaPage = lazy(() => import("@/modules/auditoria/pages/AuditoriaPage"))
const TemporadasPage = lazy(() => import("@/modules/temporadas/pages/TemporadasPage"))
const NuevaTemporadaPage = lazy(() => import("@/modules/temporadas/pages/NuevaTemporadaPage"))
const DetalleTemporadaPage = lazy(() => import("@/modules/temporadas/pages/DetalleTemporadaPage"))
const ProduccionPage = lazy(() => import("@/modules/produccion/pages/ProduccionPage"))
const NuevaProduccionPage = lazy(() => import("@/modules/produccion/pages/NuevaProduccionPage"))
const DetalleProduccionPage = lazy(() => import("@/modules/produccion/pages/DetalleProduccionPage"))
const RendimientoPage = lazy(() => import("@/modules/rendimiento/pages/RendimientoPage"))
const CategoriasPage = lazy(() => import("@/modules/categorias/pages/CategoriasPage"))
const NuevaCategoriaPage = lazy(() => import("@/modules/categorias/pages/NuevaCategoriaPage"))
const DetalleCategoriaPage = lazy(() => import("@/modules/categorias/pages/DetalleCategoriaPage"))
const ComprasPage = lazy(() => import("@/modules/compras/pages/ComprasPage"))
const NuevaCompraPage = lazy(() => import("@/modules/compras/pages/NuevaCompraPage"))
const DetalleCompraPage = lazy(() => import("@/modules/compras/pages/DetalleCompraPage"))
const AjustesPage = lazy(() => import("@/modules/ajustes/pages/AjustesPage"))
const NuevoAjustePage = lazy(() => import("@/modules/ajustes/pages/NuevoAjustePage"))
const AlertasPage = lazy(() => import("@/modules/alertas/pages/AlertasPage"))
const HistorialLaboralPage = lazy(() => import("@/modules/historial-laboral/pages/HistorialLaboralPage"))
const AsistenciasPage = lazy(() => import("@/modules/asistencias/pages/AsistenciasPage"))
const ActividadesAsignadasPage = lazy(() => import("@/modules/actividades-asignadas/pages/ActividadesAsignadasPage"))
const CalendarioPage = lazy(() => import("@/modules/calendario/pages/CalendarioPage"))
const NuevoEventoPage = lazy(() => import("@/modules/calendario/pages/NuevoEventoPage"))
const DetalleEventoPage = lazy(() => import("@/modules/calendario/pages/DetalleEventoPage"))
const EditarEventoPage = lazy(() => import("@/modules/calendario/pages/EditarEventoPage"))
const ActividadesPage = lazy(() => import("@/modules/actividades/pages/ActividadesPage"))
const NuevaActividadPage = lazy(() => import("@/modules/actividades/pages/NuevaActividadPage"))
const DetalleActividadPage = lazy(() => import("@/modules/actividades/pages/DetalleActividadPage"))
const EditarActividadPage = lazy(() => import("@/modules/actividades/pages/EditarActividadPage"))
const CajaPage = lazy(() => import("@/modules/caja/pages/CajasPage"))
const NuevaCajaPage = lazy(() => import("@/modules/caja/pages/NuevaCajaPage"))
const DetalleCajaPage = lazy(() => import("@/modules/caja/pages/DetalleCajaPage"))
const NuevoMovimientoCajaPage = lazy(() => import("@/modules/caja/pages/NuevoMovimientoCajaPage"))
const FlujoPage = lazy(() => import("@/modules/flujo/pages/FlujoPage"))
const PresupuestosPage = lazy(() => import("@/modules/presupuestos/pages/PresupuestosPage"))
const NuevoPresupuestoPage = lazy(() => import("@/modules/presupuestos/pages/NuevoPresupuestoPage"))
const DetallePresupuestoPage = lazy(() => import("@/modules/presupuestos/pages/DetallePresupuestoPage"))
const NotificacionesPage = lazy(() => import("@/modules/notificaciones/pages/NotificacionesPage"))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/recuperar-password",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <RecuperarPasswordPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "fincas", element: <SuspenseWrapper><FincasPage /></SuspenseWrapper> },
      { path: "fincas/nueva", element: <SuspenseWrapper><NuevaFincaPage /></SuspenseWrapper> },
      { path: "fincas/:id", element: <SuspenseWrapper><DetalleFincaPage /></SuspenseWrapper> },
      { path: "lotes", element: <SuspenseWrapper><LotesPage /></SuspenseWrapper> },
      { path: "lotes/nuevo", element: <SuspenseWrapper><NuevoLotePage /></SuspenseWrapper> },
      { path: "lotes/:id", element: <SuspenseWrapper><DetalleLotePage /></SuspenseWrapper> },
      { path: "cultivos", element: <SuspenseWrapper><CultivosPage /></SuspenseWrapper> },
      { path: "cultivos/nuevo", element: <SuspenseWrapper><NuevoCultivoPage /></SuspenseWrapper> },
      { path: "cultivos/:id", element: <SuspenseWrapper><DetalleCultivoPage /></SuspenseWrapper> },
      { path: "inventario", element: <SuspenseWrapper><InventarioPage /></SuspenseWrapper> },
      { path: "inventario/nuevo", element: <SuspenseWrapper><NuevoInventarioPage /></SuspenseWrapper> },
      { path: "inventario/:id", element: <SuspenseWrapper><DetalleInventariopage /></SuspenseWrapper> },
      { path: "movimientos", element: <SuspenseWrapper><MovimientosPage /></SuspenseWrapper> },
      { path: "movimientos/nuevo", element: <SuspenseWrapper><NuevoMovimientoPage /></SuspenseWrapper> },
      { path: "movimientos/:id", element: <SuspenseWrapper><DetalleMovimientoPage /></SuspenseWrapper> },
      { path: "bitacora", element: <SuspenseWrapper><BitacoraPage /></SuspenseWrapper> },
      { path: "bitacora/nueva", element: <SuspenseWrapper><NuevaBitacoraPage /></SuspenseWrapper> },
      { path: "bitacora/:id", element: <SuspenseWrapper><DetalleBitacoraPage /></SuspenseWrapper> },
      { path: "trabajadores", element: <SuspenseWrapper><TrabajadoresPage /></SuspenseWrapper> },
      { path: "trabajadores/nuevo", element: <SuspenseWrapper><NuevoTrabajadorPage /></SuspenseWrapper> },
      { path: "trabajadores/:id", element: <SuspenseWrapper><DetalleTrabajadorPage /></SuspenseWrapper> },
      { path: "jornales", element: <SuspenseWrapper><JornalesPage /></SuspenseWrapper> },
      { path: "jornales/nuevo", element: <SuspenseWrapper><NuevoJornalPage /></SuspenseWrapper> },
      { path: "jornales/:id", element: <SuspenseWrapper><DetalleJornalPage /></SuspenseWrapper> },
      { path: "ventas", element: <SuspenseWrapper><VentasPage /></SuspenseWrapper> },
      { path: "ventas/nuevo", element: <SuspenseWrapper><NuevaVentaPage /></SuspenseWrapper> },
      { path: "ventas/:id", element: <SuspenseWrapper><DetalleVentaPage /></SuspenseWrapper> },
      { path: "gastos", element: <SuspenseWrapper><GastosPage /></SuspenseWrapper> },
      { path: "gastos/nuevo", element: <SuspenseWrapper><NuevoGastoPage /></SuspenseWrapper> },
      { path: "gastos/:id", element: <SuspenseWrapper><DetalleGastoPage /></SuspenseWrapper> },
      { path: "finanzas", element: <SuspenseWrapper><FinanzasPage /></SuspenseWrapper> },
      { path: "finanzas/nuevo", element: <SuspenseWrapper><NuevaFinanzapage /></SuspenseWrapper> },
      { path: "finanzas/:id", element: <SuspenseWrapper><DetalleFinanzaPage /></SuspenseWrapper> },
      { path: "reportes", element: <SuspenseWrapper><ReportesPage /></SuspenseWrapper> },
      { path: "reportes/nuevo", element: <SuspenseWrapper><NuevoReportePage /></SuspenseWrapper> },
      { path: "reportes/:id", element: <SuspenseWrapper><DetalleReportePage /></SuspenseWrapper> },
      { path: "usuarios", element: <SuspenseWrapper><UsersPage /></SuspenseWrapper> },
      { path: "usuarios/nuevo", element: <SuspenseWrapper><CreateUserPage /></SuspenseWrapper> },
      { path: "usuarios/:id", element: <SuspenseWrapper><UserProfilePage /></SuspenseWrapper> },
      { path: "usuarios/:id/editar", element: <SuspenseWrapper><EditUserPage /></SuspenseWrapper> },
      { path: "roles", element: <SuspenseWrapper><RolesPage /></SuspenseWrapper> },
      { path: "permisos", element: <SuspenseWrapper><PermisosPage /></SuspenseWrapper> },
      { path: "auditoria", element: <SuspenseWrapper><AuditoriaPage /></SuspenseWrapper> },
      { path: "temporadas", element: <SuspenseWrapper><TemporadasPage /></SuspenseWrapper> },
      { path: "temporadas/nueva", element: <SuspenseWrapper><NuevaTemporadaPage /></SuspenseWrapper> },
      { path: "temporadas/:id", element: <SuspenseWrapper><DetalleTemporadaPage /></SuspenseWrapper> },
      { path: "produccion", element: <SuspenseWrapper><ProduccionPage /></SuspenseWrapper> },
      { path: "produccion/nuevo", element: <SuspenseWrapper><NuevaProduccionPage /></SuspenseWrapper> },
      { path: "produccion/:id", element: <SuspenseWrapper><DetalleProduccionPage /></SuspenseWrapper> },
      { path: "rendimiento", element: <SuspenseWrapper><RendimientoPage /></SuspenseWrapper> },
      { path: "categorias", element: <SuspenseWrapper><CategoriasPage /></SuspenseWrapper> },
      { path: "categorias/nueva", element: <SuspenseWrapper><NuevaCategoriaPage /></SuspenseWrapper> },
      { path: "categorias/:id", element: <SuspenseWrapper><DetalleCategoriaPage /></SuspenseWrapper> },
      { path: "compras", element: <SuspenseWrapper><ComprasPage /></SuspenseWrapper> },
      { path: "compras/nueva", element: <SuspenseWrapper><NuevaCompraPage /></SuspenseWrapper> },
      { path: "compras/:id", element: <SuspenseWrapper><DetalleCompraPage /></SuspenseWrapper> },
      { path: "ajustes", element: <SuspenseWrapper><AjustesPage /></SuspenseWrapper> },
      { path: "ajustes/nuevo", element: <SuspenseWrapper><NuevoAjustePage /></SuspenseWrapper> },
      { path: "alertas", element: <SuspenseWrapper><AlertasPage /></SuspenseWrapper> },
      { path: "historial-laboral", element: <SuspenseWrapper><HistorialLaboralPage /></SuspenseWrapper> },
      { path: "asistencias", element: <SuspenseWrapper><AsistenciasPage /></SuspenseWrapper> },
      { path: "actividades-asignadas", element: <SuspenseWrapper><ActividadesAsignadasPage /></SuspenseWrapper> },
      { path: "calendario", element: <SuspenseWrapper><CalendarioPage /></SuspenseWrapper> },
      { path: "calendario/nuevo", element: <SuspenseWrapper><NuevoEventoPage /></SuspenseWrapper> },
      { path: "calendario/:id", element: <SuspenseWrapper><DetalleEventoPage /></SuspenseWrapper> },
      { path: "calendario/:id/editar", element: <SuspenseWrapper><EditarEventoPage /></SuspenseWrapper> },
      { path: "actividades", element: <SuspenseWrapper><ActividadesPage /></SuspenseWrapper> },
      { path: "actividades/nueva", element: <SuspenseWrapper><NuevaActividadPage /></SuspenseWrapper> },
      { path: "actividades/:id", element: <SuspenseWrapper><DetalleActividadPage /></SuspenseWrapper> },
      { path: "actividades/:id/editar", element: <SuspenseWrapper><EditarActividadPage /></SuspenseWrapper> },
      { path: "caja", element: <SuspenseWrapper><CajaPage /></SuspenseWrapper> },
      { path: "caja/nueva", element: <SuspenseWrapper><NuevaCajaPage /></SuspenseWrapper> },
      { path: "caja/:id", element: <SuspenseWrapper><DetalleCajaPage /></SuspenseWrapper> },
      { path: "caja/:id/movimiento", element: <SuspenseWrapper><NuevoMovimientoCajaPage /></SuspenseWrapper> },
      { path: "flujo", element: <SuspenseWrapper><FlujoPage /></SuspenseWrapper> },
      { path: "presupuestos", element: <SuspenseWrapper><PresupuestosPage /></SuspenseWrapper> },
      { path: "presupuestos/nuevo", element: <SuspenseWrapper><NuevoPresupuestoPage /></SuspenseWrapper> },
      { path: "presupuestos/:id", element: <SuspenseWrapper><DetallePresupuestoPage /></SuspenseWrapper> },
      { path: "notificaciones", element: <SuspenseWrapper><NotificacionesPage /></SuspenseWrapper> },
      { path: "perfil", lazy: async () => { const { default: PerfilPage } = await import("@/modules/perfil/pages/PerfilPage"); return { element: <SuspenseWrapper><PerfilPage /></SuspenseWrapper> } } },
      { path: "configuracion", lazy: async () => { const { default: ConfiguracionPage } = await import("@/modules/configuracion/pages/ConfiguracionPage"); return { element: <SuspenseWrapper><ConfiguracionPage /></SuspenseWrapper> } } },
    ],
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "/500",
    element: <ServerErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])

export default appRouter
