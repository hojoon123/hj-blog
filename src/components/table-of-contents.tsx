"use client"

import { useState, useEffect } from "react"
import { List, ChevronRight, BookOpen } from "lucide-react"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

// 헤딩에서 ID 생성하는 함수
function generateHeadingId(text: string, index: number): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50)
      .replace(/^-+|-+$/g, "") || `heading-${index}`
  )
}

// 텍스트 정규화 함수 (비교용)
function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase()
}

export default function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // 목차 생성
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || []
    const tocItems: TocItem[] = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1
      const text = heading.replace(/^#+\s+/, "").trim()
      const id = generateHeadingId(text, index)

      return {
        id,
        text,
        level,
      }
    })

    setToc(tocItems)
  }, [content])

  if (toc.length === 0) return null

  // 하이퍼링크 없이 스크롤 이동하는 함수
  const handleTocClick = (text: string) => {
    const contentArea = document.querySelector(".markdown-content")
    if (!contentArea) return

    // data-heading-text 속성으로 헤딩 찾기
    const headings = contentArea.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const normalizedClickText = normalizeText(text)

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i] as HTMLElement
      const headingText = normalizeText(heading.getAttribute("data-heading-text") || heading.textContent || "")

      if (headingText === normalizedClickText) {
        // 부드러운 스크롤로 이동 (헤더 높이 고려)
        const headerHeight = 100 // 헤더 높이 + 여유 공간
        const elementPosition = heading.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })

        // 시각적 피드백 (선택사항)
        heading.style.transition = "background-color 0.3s ease"
        heading.style.backgroundColor = "rgba(59, 130, 246, 0.1)"
        setTimeout(() => {
          heading.style.backgroundColor = ""
        }, 1000)

        break
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        type="button"
        aria-label="목차 열기"
      >
        <List className="w-6 h-6" />
      </button>

      {/* 목차 - 다크모드 테두리 강화 */}
      <div
        className={`
          ${className}
          ${isOpen ? "block" : "hidden md:block"}
          w-full max-w-3xl
          bg-white dark:bg-slate-800 
          border-2 border-gray-200 dark:border-slate-600
          rounded-xl shadow-lg dark:shadow-xl dark:shadow-slate-900/50
          mb-12
          overflow-hidden
        `}
      >
        <div className="p-6">
          {/* 헤더 - 다크모드 구분선 강화 */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-slate-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              목차
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              type="button"
            >
              ×
            </button>
          </div>

          {/* 목차 항목들 */}
          <nav className="space-y-1">
            {toc.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => handleTocClick(item.text)}
                className={`
                  group w-full text-left rounded-lg transition-all duration-200
                  text-gray-700 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  hover:bg-gray-100 dark:hover:bg-slate-700
                  ${item.level === 1 ? "font-bold text-lg py-3 px-3" : ""}
                  ${item.level === 2 ? "font-semibold text-base py-2.5 px-3 pl-8" : ""}
                  ${item.level === 3 ? "font-medium text-base py-2.5 px-3 pl-12" : ""}
                  ${item.level >= 4 ? "text-sm py-2 px-3 pl-16" : ""}
                `}
                type="button"
                title={`"${item.text}"로 이동`}
              >
                <div className="flex items-start gap-3 w-full">
                  {item.level > 1 && (
                    <ChevronRight className="w-4 h-4 opacity-60 flex-shrink-0 mt-0.5 group-hover:opacity-80 transition-opacity" />
                  )}
                  <span className="leading-relaxed break-words flex-1 text-left">{item.text}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* 푸터 - 다크모드 구분선 강화 */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200 dark:border-slate-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              총 {toc.length}개 섹션 • 클릭하여 이동
            </p>
          </div>
        </div>
      </div>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="목차 닫기"
        />
      )}
    </>
  )
}
