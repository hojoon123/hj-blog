"use client"

import { useState, useEffect } from "react"
import { ChevronRight, BookOpen, ChevronUp } from "lucide-react"

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

// 마크다운 문법 제거 함수 - **볼드**, *이탤릭* 등 제거
function cleanMarkdownText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **볼드** 제거
    .replace(/\*(.*?)\*/g, "$1") // *이탤릭* 제거
    .replace(/`(.*?)`/g, "$1") // `코드` 제거
    .replace(/~~(.*?)~~/g, "$1") // ~~취소선~~ 제거
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // [링크](url) 제거
    .trim()
}

export default function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [isCollapsed, setIsCollapsed] = useState(true) // 기본적으로 접힌 상태

  // 목차 생성
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || []
    const tocItems: TocItem[] = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1
      const rawText = heading.replace(/^#+\s+/, "").trim()
      const cleanText = cleanMarkdownText(rawText) // 마크다운 문법 제거
      const id = generateHeadingId(cleanText, index)

      return {
        id,
        text: cleanText, // 정리된 텍스트 사용
        level,
      }
    })

    setToc(tocItems)
  }, [content])

  if (toc.length === 0) return null

  // 헤딩 ID로 직접 이동하는 함수
  const handleTocClick = (text: string) => {
    const cleanText = cleanMarkdownText(text)
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 120
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // 시각적 피드백
      element.style.transition = "background-color 0.3s ease"
      element.style.backgroundColor = "rgba(59, 130, 246, 0.1)"
      setTimeout(() => {
        element.style.backgroundColor = ""
      }, 1000)
    }
  }

  return (
    <>
      {/* 데스크톱 전용 목차 - 모바일에서는 숨김 */}
      <div
        className={`
          ${className}
          hidden lg:block
          fixed top-20 right-4 z-40
          w-80 max-w-[20vw]
          border rounded-lg shadow-lg overflow-hidden
          transition-all duration-300
          toc-container
          ${isCollapsed ? "w-12 h-12" : "w-80 max-h-[70vh]"}
        `}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e7eb",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* 최소화된 상태 */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full h-full flex items-center justify-center transition-colors rounded-lg toc-button"
            type="button"
            title="목차 펼치기"
            style={{
              color: "#6b7280",
            }}
          >
            <BookOpen className="w-5 h-5" />
          </button>
        )}

        {/* 펼쳐진 상태 */}
        {!isCollapsed && (
          <div className="p-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b toc-header">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                <BookOpen className="w-4 h-4 text-blue-600" />
                목차
              </h3>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded transition-colors toc-button"
                type="button"
                title="목차 접기"
                style={{
                  color: "#6b7280",
                }}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* 목차 항목들 */}
            <nav className="space-y-1 max-h-[50vh] overflow-y-auto">
              {toc.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleTocClick(item.text)}
                  className={`
                    group w-full text-left rounded transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    text-xs py-1.5 px-2 toc-item
                    ${item.level === 1 ? "font-bold" : ""}
                    ${item.level === 2 ? "font-semibold pl-4" : ""}
                    ${item.level === 3 ? "font-medium pl-6" : ""}
                    ${item.level >= 4 ? "pl-8" : ""}
                  `}
                  type="button"
                  title={`"${item.text}"로 이동`}
                  style={{
                    color: "#374151",
                  }}
                >
                  <div className="flex items-start gap-2 w-full">
                    {item.level > 1 && (
                      <ChevronRight className="w-3 h-3 opacity-60 flex-shrink-0 mt-0.5 group-hover:opacity-80 transition-opacity" />
                    )}
                    <span className="leading-relaxed break-words flex-1 text-left truncate">{item.text}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* 푸터 */}
            <div className="mt-3 pt-3 border-t toc-footer">
              <p className="text-xs text-center" style={{ color: "#6b7280" }}>
                {toc.length}개 섹션
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dark .toc-container {
          background-color: rgba(15, 23, 42, 0.95) !important;
          border-color: rgb(51 65 85) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .dark .toc-header {
          border-color: rgb(51 65 85) !important;
          color: rgb(248 250 252) !important;
        }

        .dark .toc-button {
          color: rgb(148 163 184) !important;
        }

        .dark .toc-button:hover {
          color: rgb(226 232 240) !important;
          background-color: rgb(30 41 59) !important;
        }

        .dark .toc-item {
          color: rgb(203 213 225) !important;
        }

        .dark .toc-item:hover {
          color: rgb(248 250 252) !important;
          background-color: rgb(30 41 59) !important;
        }

        .dark .toc-footer {
          border-color: rgb(51 65 85) !important;
          color: rgb(148 163 184) !important;
        }
      `}</style>
    </>
  )
}
