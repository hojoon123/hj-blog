"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import SearchDialog from "./search-dialog"

export default function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* 다크모드 호버 효과 대폭 개선 */}
      <button
        onClick={() => setIsSearchOpen(true)}
        data-search-trigger
        className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 border border-gray-200 dark:border-slate-700 dark:hover:border-slate-500 group relative overflow-hidden min-h-[44px] hover:shadow-md dark:hover:shadow-lg"
      >
        {/* 다크모드 전용 배경 효과 - 더 강하게 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

        {/* 내용 */}
        <div className="relative flex items-center gap-2">
          <Search className="w-4 h-4 md:w-5 md:h-5 transition-all duration-200 group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
          <span className="hidden sm:inline font-medium">검색</span>
          <kbd className="hidden lg:inline-block px-2 py-1 text-xs bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600 border border-gray-300 dark:border-slate-600 dark:group-hover:border-slate-500 rounded-md text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300 font-mono transition-all duration-200">
            ⌘K
          </kbd>
        </div>
      </button>

      {/* 검색 다이얼로그 */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
