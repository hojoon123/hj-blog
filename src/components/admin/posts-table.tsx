"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, FileText, MoreVertical } from "lucide-react"
import type { PostWithCategory } from "@/types/blog"

interface PostsTableProps {
  posts: PostWithCategory[]
  onDelete: (id: string) => Promise<void>
  onTogglePublish: (id: string, published: boolean) => Promise<void>
}

interface PostsTableState {
  deletingId: string | null
  openMenuId: string | null
}

export default function PostsTable({ posts, onDelete, onTogglePublish }: PostsTableProps) {
  const router = useRouter()
  const [state, setState] = useState<PostsTableState>({
    deletingId: null,
    openMenuId: null,
  })

  const handleDelete = async (id: string, title: string): Promise<void> => {
    if (confirm(`"${title}" 포스트를 삭제하시겠습니까?`)) {
      setState((prev) => ({ ...prev, deletingId: id }))
      try {
        await onDelete(id)
      } finally {
        setState((prev) => ({ ...prev, deletingId: null }))
      }
    }
  }

  const handleEdit = (postId: string): void => {
    router.push(`/admin/posts/${postId}/edit`)
  }

  const handleView = (slug: string): void => {
    window.open(`/post/${slug}`, "_blank")
  }

  const handleTogglePublish = async (id: string, currentPublished: boolean): Promise<void> => {
    try {
      await onTogglePublish(id, !currentPublished)
    } catch (error) {
      console.error("Toggle publish error:", error)
    }
  }

  const toggleMenu = (postId: string) => {
    setState((prev) => ({
      ...prev,
      openMenuId: prev.openMenuId === postId ? null : postId,
    }))
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{post.excerpt}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {post.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">미분류</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                    type="button"
                  >
                    {post.published ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">발행됨</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">임시저장</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    {post.view_count}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(post.slug)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      title="포스트 보기"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(post.id)}
                      className="p-2.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:scale-105 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800"
                      title="편집"
                      type="button"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={state.deletingId === post.id}
                      className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-105 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                      title="삭제"
                      type="button"
                    >
                      {state.deletingId === post.id ? (
                        <div className="w-4 h-4 animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 레이아웃 */}
      <div className="md:hidden">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="p-4 space-y-3">
              {/* 제목과 메뉴 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                  )}
                </div>

                {/* 모바일 메뉴 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(post.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    type="button"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {state.openMenuId === post.id && (
                    <>
                      {/* 배경 오버레이 */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setState((prev) => ({ ...prev, openMenuId: null }))}
                      />

                      {/* 메뉴 */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleView(post.slug)
                              setState((prev) => ({ ...prev, openMenuId: null }))
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3"
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                            포스트 보기
                          </button>
                          <button
                            onClick={() => {
                              handleEdit(post.id)
                              setState((prev) => ({ ...prev, openMenuId: null }))
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3"
                            type="button"
                          >
                            <Edit className="w-4 h-4" />
                            편집
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(post.id, post.title)
                              setState((prev) => ({ ...prev, openMenuId: null }))
                            }}
                            disabled={state.deletingId === post.id}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50"
                            type="button"
                          >
                            {state.deletingId === post.id ? (
                              <div className="w-4 h-4 animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            삭제
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  {/* 카테고리 */}
                  {post.category ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">미분류</span>
                  )}

                  {/* 조회수 */}
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.view_count}
                  </div>
                </div>

                {/* 작성일 */}
                <time>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </time>
              </div>

              {/* 상태 토글 */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">발행 상태</span>
                <button
                  onClick={() => handleTogglePublish(post.id, post.published)}
                  className="flex items-center gap-2 hover:opacity-75 transition-opacity min-h-[44px] px-2"
                  type="button"
                >
                  {post.published ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">발행됨</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">임시저장</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">포스트가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
