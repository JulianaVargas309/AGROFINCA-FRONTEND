import { createContext, useState, useCallback, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored
    return "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [])

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}
