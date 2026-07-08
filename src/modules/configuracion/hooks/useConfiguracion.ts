import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useCallback } from "react"
import type { ConfiguracionInput } from "../schemas/configuracion.schema"

export function useConfiguracion() {
  const [config, setConfig] = useLocalStorage<ConfiguracionInput>("agrofinca_config", {
    tema: "claro",
    idioma: "es",
    notificaciones: true,
  })

  const updateConfig = useCallback(
    (data: Partial<ConfiguracionInput>) => {
      setConfig((prev) => ({ ...prev, ...data }))
    },
    [setConfig],
  )

  return { config, updateConfig }
}
