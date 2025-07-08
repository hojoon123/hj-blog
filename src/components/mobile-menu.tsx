"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { X, ChevronRight } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

export default function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  // 키보드 이벤트 & 스크롤 방지
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    // 스크롤 방지
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      >
        {/* 사이드바 - 높이 문제 해결 */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 - 고정 높이 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HJ</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">메뉴</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
              aria-label="메뉴 닫기"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
            </button>
          </div>

          {/* 메뉴 내용 - 스크롤 영역 수정 */}
          <div className="flex flex-col h-full">
            {/* 스크롤 가능한 메인 콘텐츠 */}
            <div className="flex-1 overflow-y-auto">
              {/* 카테고리 목록 - 바로 표시 */}
              <div className="p-6">
                <div className="space-y-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-4 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 group"
                      >
                        <span className="font-medium text-base">{category.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p className="text-sm">카테고리가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 푸터 - 고정 위치 */}
            <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">HJ Blog</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">개발 지식을 나누는 공간</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
