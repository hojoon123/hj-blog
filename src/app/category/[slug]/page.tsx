import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByCategory, getCategoryBySlug } from "@/lib/blog-service"
import PostCard from "@/components/post-card"
import Link from "next/link"
import { ArrowLeft, Folder } from "lucide-react"
import { siteConfig } from "@/utils/site-config"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const category = await getCategoryBySlug(slug)

    if (!category) {
      return {
        title: "카테고리를 찾을 수 없습니다 | " + siteConfig.name,
        description: "요청하신 카테고리를 찾을 수 없습니다.",
      }
    }

    return {
      title: `${category.name} | ${siteConfig.name}`,
      description: `${category.name} 카테고리의 모든 게시글을 확인해보세요. 개발 관련 지식과 경험을 공유합니다.`,
      keywords: [category.name, "개발", "블로그", "카테고리", ...siteConfig.seo.keywords],
      openGraph: {
        title: `${category.name} 카테고리`,
        description: `${category.name} 카테고리의 모든 게시글`,
        type: "website",
        url: `${siteConfig.url}/category/${category.slug}`,
      },
      twitter: {
        card: "summary",
        title: `${category.name} 카테고리`,
        description: `${category.name} 카테고리의 모든 게시글`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata for category:", error)
    return {
      title: "카테고리를 찾을 수 없습니다 | " + siteConfig.name,
      description: "요청하신 카테고리를 찾을 수 없습니다.",
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const category = await getCategoryBySlug(slug)

    if (!category) {
      notFound()
    }

    const posts = await getPostsByCategory(category.id)

    return (
      <main className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900 min-h-screen">
        {/* 뒤로가기 버튼 */}
        <nav className="mb-8" aria-label="페이지 네비게이션">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="홈으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로 돌아가기</span>
          </Link>
        </nav>

        {/* 카테고리 헤더 */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">{posts.length}개의 게시글</p>
        </header>

        {/* 게시글 목록 */}
        <section aria-labelledby="category-posts">
          <h2 id="category-posts" className="sr-only">
            {category.name} 카테고리 게시글 목록
          </h2>

          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">게시글이 없습니다</h3>
              <p className="text-gray-500 dark:text-gray-400">이 카테고리에는 아직 게시글이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    )
  } catch (error) {
    console.error("Error rendering category page:", error)
    notFound()
  }
}
