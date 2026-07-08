const LOCALE = "es-CO"

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
})

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
})

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeStyle: "short",
})

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeStyle: "short",
})

export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return shortDateFormatter.format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return dateTimeFormatter.format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return timeFormatter.format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = Date.now()
  const target = new Date(date).getTime()
  const diffMs = now - target
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Ahora mismo"
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays < 7) return `Hace ${diffDays} d`
  return formatShortDate(date)
}

export function formatInputDate(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}
