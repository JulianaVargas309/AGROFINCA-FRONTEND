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
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fincas",
        element: (
          <SuspenseWrapper>
            <FincasPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fincas/nueva",
        element: (
          <SuspenseWrapper>
            <NuevaFincaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fincas/:id",
        element: (
          <SuspenseWrapper>
            <DetalleFincaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "lotes",
        element: (
          <SuspenseWrapper>
            <LotesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "lotes/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoLotePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "lotes/:id",
        element: (
          <SuspenseWrapper>
            <DetalleLotePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cultivos",
        element: (
          <SuspenseWrapper>
            <CultivosPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cultivos/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoCultivoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cultivos/:id",
        element: (
          <SuspenseWrapper>
            <DetalleCultivoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "inventario",
        element: (
          <SuspenseWrapper>
            <InventarioPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "inventario/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoInventarioPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "inventario/:id",
        element: (
          <SuspenseWrapper>
            <DetalleInventariopage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "movimientos",
        element: (
          <SuspenseWrapper>
            <MovimientosPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "movimientos/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoMovimientoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "movimientos/:id",
        element: (
          <SuspenseWrapper>
            <DetalleMovimientoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "bitacora",
        element: (
          <SuspenseWrapper>
            <BitacoraPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "bitacora/nueva",
        element: (
          <SuspenseWrapper>
            <NuevaBitacoraPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "bitacora/:id",
        element: (
          <SuspenseWrapper>
            <DetalleBitacoraPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "trabajadores",
        element: (
          <SuspenseWrapper>
            <TrabajadoresPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "trabajadores/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoTrabajadorPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "trabajadores/:id",
        element: (
          <SuspenseWrapper>
            <DetalleTrabajadorPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "jornales",
        element: (
          <SuspenseWrapper>
            <JornalesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "jornales/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoJornalPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "jornales/:id",
        element: (
          <SuspenseWrapper>
            <DetalleJornalPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "finanzas",
        element: (
          <SuspenseWrapper>
            <FinanzasPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "finanzas/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevaFinanzapage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "finanzas/:id",
        element: (
          <SuspenseWrapper>
            <DetalleFinanzaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "ventas",
        element: (
          <SuspenseWrapper>
            <VentasPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "ventas/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevaVentaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "ventas/:id",
        element: (
          <SuspenseWrapper>
            <DetalleVentaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gastos",
        element: (
          <SuspenseWrapper>
            <GastosPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gastos/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoGastoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gastos/:id",
        element: (
          <SuspenseWrapper>
            <DetalleGastoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reportes",
        element: (
          <SuspenseWrapper>
            <ReportesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reportes/nuevo",
        element: (
          <SuspenseWrapper>
            <NuevoReportePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reportes/:id",
        element: (
          <SuspenseWrapper>
            <DetalleReportePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "perfil",
        lazy: async () => {
          const { default: PerfilPage } = await import("@/modules/perfil/pages/PerfilPage")
          return {
            element: (
              <SuspenseWrapper>
                <PerfilPage />
              </SuspenseWrapper>
            ),
          }
        },
      },
      {
        path: "configuracion",
        lazy: async () => {
          const { default: ConfiguracionPage } = await import("@/modules/configuracion/pages/ConfiguracionPage")
          return {
            element: (
              <SuspenseWrapper>
                <ConfiguracionPage />
              </SuspenseWrapper>
            ),
          }
        },
      },
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
