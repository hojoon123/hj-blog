"use client"

import { useState, useEffect } from "react"
import AdminGuard from "@/components/admin-guard"
import PostsTable from "@/components/admin/posts-table"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { PostWithCategory, PostsApiResponse, ApiError } from "@/types/blog"

interface PostsManagementState {
  posts: PostWithCategory[]
  loading: boolean
  refreshing: boolean
}

export default function PostsManagement() {
  const [state, setState] = useState<PostsManagementState>({
    posts: [],
    loading: true,
    refreshing: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/posts")

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || "포스트를 불러오는데 실패했습니다.")
      }

      const data: PostsApiResponse = await response.json()

      setState((prev) => ({
        ...prev,
        posts: data.posts || [],
        loading: false,
        refreshing: false,
      }))
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
      }))
    }
  }

  const handleRefresh = (): void => {
    setState((prev) => ({ ...prev, refreshing: true }))
    fetchPosts()
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setState((prev) => ({
          ...prev,
          posts: prev.posts.filter((post) => post.id !== id),
        }))

        // 목록 새로고침
        setTimeout(() => {
          fetchPosts()
        }, 500)
      } else {
        alert(`포스트 삭제에 실패했습니다: ${result.error || "알 수 없는 오류"}`)
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("포스트 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleTogglePublish = async (id: string, published: boolean): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setState((prev) => ({
          ...prev,
          posts: prev.posts.map((post) => (post.id === id ? { ...post, published } : post)),
        }))
      } else {
        alert(`포스트 상태 변경에 실패했습니다: ${result.error || "알 수 없는 오류"}`)
      }
    } catch (error) {
      console.error("Toggle publish error:", error)
      alert("포스트 상태 변경 중 오류가 발생했습니다.")
    }
  }

  if (state.loading) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">포스트 관리</h1>
            <p className="text-gray-600 dark:text-gray-400">총 {state.posts.length}개의 포스트</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={state.refreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 ${state.refreshing ? "animate-spin" : ""}`} />
              새로고침
            </button>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />새 포스트
            </Link>
          </div>
        </div>

        <PostsTable posts={state.posts} onDelete={handleDelete} onTogglePublish={handleTogglePublish} />
      </div>
    </AdminGuard>
  )
}
