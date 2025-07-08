"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AdminGuard from "@/components/admin-guard"
import PostEditor from "@/components/admin/post-editor"
import type { PostWithCategory, PostApiResponse, ApiError } from "@/types/blog"

interface EditPostPageState {
  post: PostWithCategory | null
  loading: boolean
  error: string | null
}

export default function EditPostPage() {
  const params = useParams()
  const postId = params.id as string

  const [state, setState] = useState<EditPostPageState>({
    post: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch(`/api/admin/posts/${postId}`)

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || "포스트를 찾을 수 없습니다.")
      }

      const data: PostApiResponse = await response.json()

      setState((prev) => ({
        ...prev,
        post: data.post,
        loading: false,
      }))
    } catch (error) {
      console.error("Failed to fetch post:", error)
      const errorMessage = error instanceof Error ? error.message : "포스트를 불러오는데 실패했습니다."

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  const handleGoBack = (): void => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/admin/posts"
    }
  }

  // 로딩 상태
  if (state.loading) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  // 에러 상태
  if (state.error) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">오류 발생</h2>
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <button
                onClick={handleGoBack}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  // 포스트가 없는 경우
  if (!state.post) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                포스트를 찾을 수 없습니다
              </h2>
              <p className="text-yellow-600 dark:text-yellow-400">
                요청하신 포스트가 존재하지 않거나 삭제되었을 수 있습니다.
              </p>
              <button
                onClick={handleGoBack}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  // 정상 렌더링
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <PostEditor
          initialData={{
            title: state.post.title,
            content: state.post.content,
            excerpt: state.post.excerpt || "",
            thumbnail_url: state.post.thumbnail_url || "",
            category_id: state.post.category_id || "",
            published: state.post.published,
          }}
          postId={postId}
          isEdit={true}
        />
      </div>
    </AdminGuard>
  )
}
