"use client"

import { useAuth } from "@/contexts/auth-context"
import { LogOut, Settings, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminHeaderActions() {
  const { user, isAdmin, signOut } = useAuth()

  if (!user || !isAdmin) return null

  return (
    <div className="flex items-center gap-2">
      {/* 새 포스트 작성 */}
      <Link
        href="/admin/posts/new"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">새 포스트</span>
      </Link>

      {/* 관리자 페이지 */}
      <Link
        href="/admin"
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        title="관리자 페이지"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* 로그아웃 */}
      <button
        onClick={signOut}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        title="로그아웃"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* 사용자 정보 */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{user.email?.[0].toUpperCase()}</span>
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
      </div>
    </div>
  )
}
