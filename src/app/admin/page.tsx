"use client"

import { useState, useEffect } from "react"
import AdminGuard from "@/components/admin-guard"
import StatsCards from "@/components/admin/stats-cards"
import { BarChart3, FileText, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface StatsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  categoryStats: Record<string, number>
  recentPosts: Array<{
    id: string
    title: string
    created_at: string
    published: boolean
    view_count: number
    category: { name: string } | null
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400">HJ Blog 관리 및 통계를 확인하세요.</p>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <>
            <StatsCards stats={stats} />

            {/* 빠른 액션 */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/posts"
                className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">포스트 관리</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">포스트 목록 및 편집</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/posts/new"
                className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">새 포스트</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">새로운 포스트 작성</p>
                  </div>
                </div>
              </Link>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">카테고리별 통계</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {Object.entries(stats.categoryStats).map(([category, count]) => (
                        <div key={category}>
                          {category}: {count}개
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 포스트 */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 포스트</h2>
                <Link
                  href="/admin/posts"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  전체 보기 →
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recentPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </span>
                            {post.category && <span>{post.category.name}</span>}
                            <span>조회 {post.view_count}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.published
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            }`}
                          >
                            {post.published ? "발행됨" : "임시저장"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminGuard>
  )
}
