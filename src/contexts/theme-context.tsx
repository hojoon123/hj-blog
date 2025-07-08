"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // 초기 테마 로드
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as Theme
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const initialTheme = savedTheme || systemTheme

        console.log("🎨 Theme loading:", { savedTheme, systemTheme, initialTheme })
        setTheme(initialTheme)
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error)
      setTheme("light")
    }
    setMounted(true)
  }, [])

  // 테마 변경 시 DOM 업데이트 (더 강력하게)
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const htmlElement = document.documentElement
        const bodyElement = document.body

        // 모든 테마 클래스 제거
        htmlElement.classList.remove("light", "dark")
        bodyElement.classList.remove("light", "dark")

        // 새 테마 클래스 추가
        htmlElement.classList.add(theme)
        bodyElement.classList.add(theme)

        // 데이터 속성도 추가
        htmlElement.setAttribute("data-theme", theme)
        bodyElement.setAttribute("data-theme", theme)

        // CSS 변수 직접 설정 (백업)
        if (theme === "dark") {
          htmlElement.style.setProperty("--background", "#0f172a")
          htmlElement.style.setProperty("--foreground", "#f1f5f9")
          htmlElement.style.setProperty("--surface", "#1e293b")
          htmlElement.style.setProperty("--border", "#334155")
          htmlElement.style.setProperty("--muted", "#94a3b8")
        } else {
          htmlElement.style.setProperty("--background", "#ffffff")
          htmlElement.style.setProperty("--foreground", "#171717")
          htmlElement.style.setProperty("--surface", "#f8fafc")
          htmlElement.style.setProperty("--border", "#e2e8f0")
          htmlElement.style.setProperty("--muted", "#64748b")
        }

        localStorage.setItem("theme", theme)

        console.log("🎨 Theme applied:", {
          theme,
          htmlClasses: htmlElement.className,
          bodyClasses: bodyElement.className,
          dataTheme: htmlElement.getAttribute("data-theme"),
          cssVars: {
            background: getComputedStyle(htmlElement).getPropertyValue("--background"),
            foreground: getComputedStyle(htmlElement).getPropertyValue("--foreground"),
          },
        })
      } catch (error) {
        console.warn("Failed to apply theme:", error)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    console.log("🎨 Theme toggle:", theme, "→", newTheme)
    setTheme(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
