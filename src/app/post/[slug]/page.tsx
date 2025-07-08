import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPost } from "@/lib/blog-service"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import MarkdownRenderer from "@/components/markdown-renderer"
import TableOfContents from "@/components/table-of-contents"
import StructuredData from "@/components/structured-data"
import { siteConfig, getFullUrl, getImageUrl } from "@/utils/site-config"
import "@/app/markdown-styles.css"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 완전히 동적 생성으로 변경
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      return {
        title: "포스트를 찾을 수 없습니다",
      }
    }

    const post = await getPost(slug)

    if (!post) {
      return {
        title: "포스트를 찾을 수 없습니다",
      }
    }

    const postUrl = getFullUrl(`/post/${post.slug}`)
    const imageUrl = post.thumbnail_url ? getImageUrl(post.thumbnail_url) : getImageUrl(siteConfig.seo.ogImage)

    // 키워드 생성 (카테고리 + 기본 키워드)
    const keywords = [
      ...siteConfig.seo.keywords,
      ...(post.category ? [post.category.name] : []),
      ...post.title.split(" ").slice(0, 3), // 제목에서 주요 단어 추출
    ].filter(Boolean)

    return {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt || post.content.slice(0, 160),
      keywords: keywords,
      authors: [{ name: siteConfig.author }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        type: "article",
        url: postUrl,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [siteConfig.author],
        tags: post.category ? [post.category.name] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        images: [imageUrl],
      },
      alternates: {
        canonical: postUrl,
      },
    }
  } catch (error) {
    console.error("Error generating metadata for post:", error)
    return {
      title: "포스트를 찾을 수 없습니다",
      description: "요청하신 포스트를 찾을 수 없습니다.",
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      notFound()
    }

    const post = await getPost(slug)

    if (!post) {
      notFound()
    }

    const getImageSrc = (thumbnailUrl: string | undefined) => {
      if (!thumbnailUrl) {
        return "/api/placeholder?height=450&width=800"
      }
      if (thumbnailUrl.startsWith("/placeholder.svg")) {
        return `${thumbnailUrl}?height=450&width=800`
      }
      return thumbnailUrl
    }

    const postUrl = getFullUrl(`/post/${post.slug}`)
    const imageUrl = post.thumbnail_url ? getImageUrl(post.thumbnail_url) : getImageUrl(siteConfig.seo.ogImage)

    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <StructuredData
          type="article"
          data={{
            title: post.title,
            description: post.excerpt || post.content.slice(0, 160),
            url: postUrl,
            image: imageUrl,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: siteConfig.author,
            category: post.category?.name,
          }}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white dark:bg-slate-900">
              {/* 포스트 헤더 - main과 동일한 배경 */}
              <header className="mb-8 bg-white dark:bg-slate-900">
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 rounded-full text-sm mb-4 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
                  >
                    {post.category.name}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <time dateTime={post.created_at}>
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </time>
                  <span>조회 {post.view_count}</span>
                </div>
                {/* 썸네일 이미지 */}
                {post.thumbnail_url && (
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <Image
                      src={getImageSrc(post.thumbnail_url) || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                )}
              </header>

              {/* 목차 */}
              <TableOfContents content={post.content} />

              {/* 포스트 내용 - 목차와 더 큰 간격 */}
              <div className="markdown-content mt-24">
                <MarkdownRenderer content={post.content} />
              </div>

              {/* 콘텐츠 하단 여백 - 충분한 호흡 공간 확보 */}
              <div className="mt-20"></div>

              {/* 뒤로 가기 - 콘텐츠와 충분한 간격 */}
              <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  ← 목록으로 돌아가기
                </Link>
              </div>

              {/* 페이지 하단 추가 여백 - 스크롤 여유 공간 */}
              <div className="pb-20"></div>
            </article>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error rendering post page:", error)
    notFound()
  }
}
