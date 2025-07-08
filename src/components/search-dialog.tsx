"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, X, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { searchPosts } from "@/lib/search-service"
import type { PostWithCategory } from "@/types/blog"

interface SearchResult {
  posts: PostWithCategory[]
  query: string
  count: number
}

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult>({ posts: [], query: "", count: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // 검색 함수 (디바운싱)
  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const data = await searchPosts(searchQuery)
      setResults(data)
    } catch (error) {
      console.error("Search failed:", error)
      setResults({ posts: [], query: searchQuery, count: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 디바운싱된 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // 검색어 저장
  const saveRecentSearch = (searchQuery: string) => {
    if (searchQuery.trim().length < 2) return

    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recent-searches", JSON.stringify(updated))
  }

  // 개별 검색어 삭제
  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter((s) => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem("recent-searches", JSON.stringify(updated))
  }

  // 모든 검색어 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  // 키보드 이벤트 & 바깥 클릭 처리
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)

    // body 스크롤 방지
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // 다이얼로그가 열릴 때 검색어 초기화 및 포커스
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setResults({ posts: [], query: "", count: 0 })

      // 모바일에서 키보드 자동 포커스 (약간의 지연 후)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()

          // iOS Safari에서 키보드 강제 표시
          if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            inputRef.current.click()
          }
        }
      }, 100)
    }
  }, [isOpen])

  // 텍스트 하이라이팅
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-16 md:pt-20">
        <div
          ref={dialogRef}
          className="max-w-2xl mx-auto bg-white dark:bg-dark-surface rounded-lg shadow-2xl overflow-hidden border dark:border-dark-border"
        >
          {/* 검색 입력 - 모바일 최적화 */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-dark-border">
            <Search className="w-5 h-5 text-gray-400 dark:text-dark-muted mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="포스트 검색... (최소 2글자)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-base md:text-lg outline-none bg-transparent text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              inputMode="search"
              enterKeyHint="search"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ml-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              type="button"
            >
              <X className="w-5 h-5 text-gray-400 dark:text-dark-muted" />
            </button>
          </div>

          {/* 검색 결과 - 모바일 스크롤 최적화 */}
          <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500 dark:text-dark-muted">검색 중...</p>
              </div>
            ) : query.trim().length >= 2 ? (
              results.count > 0 ? (
                <div>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-dark-muted">
                    "{results.query}"에 대한 {results.count}개의 결과
                  </div>
                  {results.posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      onClick={() => {
                        saveRecentSearch(query)
                        onClose()
                      }}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-dark-border last:border-b-0 transition-colors"
                    >
                      <div className="flex gap-3">
                        {post.thumbnail_url && (
                          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                            <Image
                              src={post.thumbnail_url || "/placeholder.svg"}
                              alt={post.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1 line-clamp-2 text-sm md:text-base">
                            {highlightText(post.title, results.query)}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-2 line-clamp-2">
                              {highlightText(post.excerpt, results.query)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                            {post.category && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                {post.category.name}
                              </span>
                            )}
                            <span>
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-dark-muted mb-2">"{query}"에 대한 검색 결과가 없습니다.</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">다른 키워드로 검색해보세요.</p>
                </div>
              )
            ) : (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        최근 검색어
                      </h3>
                      <button
                        onClick={clearAllRecentSearches}
                        className="text-xs text-gray-500 dark:text-dark-muted hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 p-2 min-h-[44px]"
                        type="button"
                      >
                        <Trash2 className="w-3 h-3" />
                        전체 삭제
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between px-3 py-3 text-sm text-gray-600 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          <button
                            onClick={() => setQuery(search)}
                            className="flex-1 text-left truncate min-h-[44px] flex items-center"
                            type="button"
                          >
                            {search}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecentSearch(search)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="검색어 삭제"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  <p>검색어를 입력하세요 (최소 2글자)</p>
                  <p className="mt-2 hidden md:block">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl</kbd> +{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">K</kbd> 로 빠른 검색
                  </p>
                  <p className="mt-2 text-xs">
                    바깥 영역 터치 또는{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">ESC</kbd>로 닫기
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
