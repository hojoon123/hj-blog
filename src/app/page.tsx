import type { Metadata } from "next"
import { getPosts } from "@/lib/blog-service"
import PostCard from "@/components/post-card"
import { siteConfig, getSeoConfig, getImageUrl } from "@/utils/site-config"

const seoConfig = getSeoConfig()

export const metadata: Metadata = {
  title: `${siteConfig.name} - 코딩 강사의 개발 이야기`,
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    title: `${siteConfig.name} - 코딩 강사의 개발 이야기`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: getImageUrl(siteConfig.seo.ogImage),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - 코딩 강사의 개발 이야기`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - 코딩 강사의 개발 이야기`,
    description: siteConfig.description,
    images: [getImageUrl(siteConfig.seo.ogImage)],
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900 min-h-screen">
      {/* 히어로 섹션 */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          개발 지식을 나누는 공간
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          실무 경험과 강의 노하우를 바탕으로 한 개발 지식을 공유합니다.
          <br />
          <span className="text-lg mt-2 block">Python, JavaScript, 정보과학 교육 전문</span>
        </p>
      </section>

      {/* 포스트 그리드 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">최근 포스트</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">데이터베이스 연결 완료!</h3>
              <p className="text-blue-700 dark:text-blue-400 mb-4">샘플 데이터가 로드되지 않았습니다.</p>
              <p className="text-sm text-blue-600 dark:text-blue-500">
                Supabase에서 샘플 데이터 스크립트를 실행해주세요.
              </p>
            </div>
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
}
