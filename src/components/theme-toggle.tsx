"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 md:p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative overflow-hidden min-h-[44px] min-w-[44px] flex items-center justify-center hover:shadow-md dark:hover:shadow-lg border border-transparent dark:hover:border-slate-500"
      title={theme === "light" ? "다크모드로 전환" : "라이트모드로 전환"}
      aria-label={theme === "light" ? "다크모드로 전환" : "라이트모드로 전환"}
    >
      {/* 다크모드 전용 배경 효과 - 더 강하게 */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 dark:from-orange-400/20 dark:to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

      {/* 아이콘 */}
      <div className="relative">
        {theme === "light" ? (
          <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 transition-all duration-200 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 transition-all duration-200 group-hover:scale-110 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:rotate-12" />
        )}
      </div>
    </button>
  )
}
