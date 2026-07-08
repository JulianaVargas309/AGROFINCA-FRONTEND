export type ID = number | string

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type WithId = { id: ID }

export type Option<T extends string = string> = {
  value: T
  label: string
}

export type Severity = "info" | "success" | "warning" | "error"

export type Size = "sm" | "md" | "lg"

export type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger"

export type SortDirection = "asc" | "desc"

export interface SortConfig {
  key: string
  direction: SortDirection
}

export interface FilterOption {
  key: string
  value: string
  label: string
}
