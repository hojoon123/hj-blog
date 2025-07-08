import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByCategory, getCategories } from "@/lib/blog-service"
import PostCard from "@/components/post-card"
import StructuredData from "@/components/structured-data"
import { siteConfig, getFullUrl, getImageUrl } from "@/utils/site-config"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// 완전히 동적 생성으로 변경 - generateStaticParams 제거
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = params

    if (!slug) {
      return {
        title: "카테고리를 찾을 수 없습니다",
      }
    }

    const categories = await getCategories()
    const category = categories.find((c) => c.slug === slug)

    if (!category) {
      return {
        title: "카테고리를 찾을 수 없습니다",
      }
    }

    const categoryUrl = getFullUrl(`/category/${category.slug}`)
    const description = category.description || `${category.name} 관련 포스트들을 확인해보세요.`

    return {
      title: `${category.name} | ${siteConfig.name}`,
      description: description,
      keywords: [...siteConfig.seo.keywords, category.name],
      openGraph: {
        title: `${category.name} - ${siteConfig.name}`,
        description: description,
        type: "website",
        url: categoryUrl,
        images: [
          {
            url: getImageUrl(siteConfig.seo.ogImage),
            width: 1200,
            height: 630,
            alt: `${category.name} - ${siteConfig.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${category.name} - ${siteConfig.name}`,
        description: description,
        images: [getImageUrl(siteConfig.seo.ogImage)],
      },
      alternates: {
        canonical: categoryUrl,
      },
    }
  } catch (error) {
    console.error("Error generating metadata for category:", error)
    return {
      title: "카테고리를 찾을 수 없습니다",
      description: "요청하신 카테고리를 찾을 수 없습니다.",
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const { slug } = params

    if (!slug) {
      notFound()
    }

    const [categories, posts] = await Promise.all([getCategories(), getPostsByCategory(slug)])

    const category = categories.find((c) => c.slug === slug)

    if (!category) {
      notFound()
    }

    const categoryUrl = getFullUrl(`/category/${category.slug}`)

    return (
      <main className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900 min-h-screen">
        <StructuredData
          type="website"
          data={{
            title: `${category.name} - ${siteConfig.name}`,
            description: category.description || `${category.name} 관련 포스트들을 확인해보세요.`,
            url: categoryUrl,
          }}
        />

        {/* 카테고리 헤더 */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{category.name}</h1>
          {category.description && <p className="text-lg text-gray-600 dark:text-gray-400">{category.description}</p>}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">총 {posts.length}개의 포스트</div>
        </section>

        {/* 포스트 목록 */}
        <section>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">이 카테고리에는 아직 포스트가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
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
