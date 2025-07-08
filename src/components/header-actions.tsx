"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import SearchButton from "./search-button"
import MobileMenu from "./mobile-menu"

// ThemeToggle을 동적으로 import
const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
  ),
})

interface HeaderActionsProps {
  categories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

export default function HeaderActions({ categories = [] }: HeaderActionsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2 md:gap-3">
        {/* 검색 버튼 - 호버 효과 개선 */}
        <SearchButton />

        {/* 테마 토글 - 호버 효과 개선 */}
        <ThemeToggle />

        {/* 개선된 모바일 메뉴 버튼 - 더 큰 터치 영역 */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden relative p-3 md:p-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="메뉴 열기"
        >
          {/* 햄버거 아이콘 - 더 큰 크기 */}
          <div className="w-6 h-6 md:w-7 md:h-7 flex flex-col justify-center items-center gap-1.5">
            <div className="w-5 h-0.5 md:w-6 md:h-0.5 bg-current rounded-full transition-all duration-200 group-hover:w-6 md:group-hover:w-7"></div>
            <div className="w-4 h-0.5 md:w-5 md:h-0.5 bg-current rounded-full transition-all duration-200 group-hover:w-6 md:group-hover:w-7"></div>
            <div className="w-5 h-0.5 md:w-6 md:h-0.5 bg-current rounded-full transition-all duration-200 group-hover:w-6 md:group-hover:w-7"></div>
          </div>

          {/* 호버 시 배경 효과 - 그라데이션 추가 */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={categories} />
    </>
  )
}
