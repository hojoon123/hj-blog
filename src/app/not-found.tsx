import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | HJ Blog",
  description: "요청하신 페이지를 찾을 수 없습니다. 홈페이지로 돌아가서 다른 콘텐츠를 확인해보세요.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            홈페이지로 돌아가기
          </Link>
          <div>
            <Link
              href="/admin"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              관리자 페이지
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
