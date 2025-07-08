import Link from "next/link"
import { getCategories } from "@/lib/blog-service"
import HeaderActions from "./header-actions"
import AdminHeaderActions from "./admin-header-actions"

export default async function Header() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2"
          >
            HJ Blog
          </Link>

          {/* 데스크톱 네비게이션 - 호버 효과 개선 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
            >
              전체
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* 우측 액션들 */}
          <div className="flex items-center gap-4">
            {/* 관리자 액션 */}
            <AdminHeaderActions />
            {/* 일반 사용자 액션 */}
            <HeaderActions categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
