"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield, AlertCircle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login")
    }
  }, [user, loading, router])

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 경우
  if (!user) {
    return null // useEffect에서 리다이렉트 처리
  }

  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="max-w-md w-full text-center p-6">
            <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">접근 권한이 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">관리자 권한이 필요한 페이지입니다.</p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      )
    )
  }

  // 관리자인 경우 컨텐츠 표시
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-b border-blue-200 dark:border-blue-800">
        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm text-blue-800 dark:text-blue-300">관리자 모드</span>
      </div>
      {children}
    </div>
  )
}
