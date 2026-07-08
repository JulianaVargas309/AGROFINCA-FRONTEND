import type { ReactNode } from "react"

interface NoDataProps {
  message?: string
  children?: ReactNode
}

function NoData({ message = "No se encontraron resultados.", children }: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm text-stone-500">{message}</p>
      {children}
    </div>
  )
}

export { NoData }
export type { NoDataProps }
