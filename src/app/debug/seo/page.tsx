import { getDebugInfo, getSeoConfig, getEnvironmentInfo } from "@/utils/site-config"
import { getPosts, getCategories } from "@/lib/blog-service"

export default async function SEODebugPage() {
  // 프로덕션에서는 접근 차단
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 불가</h1>
          <p>이 페이지는 개발 환경에서만 접근 가능합니다.</p>
        </div>
      </div>
    )
  }

  const debugInfo = getDebugInfo()
  const seoConfig = getSeoConfig()
  const envInfo = getEnvironmentInfo()
  const posts = await getPosts()
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">SEO 디버그 정보</h1>

        {/* 환경 정보 */}
        <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">🌍 환경 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>환경:</strong> {envInfo.nodeEnv}
            </div>
            <div>
              <strong>베이스 URL:</strong> {envInfo.baseUrl}
            </div>
            <div>
              <strong>커스텀 도메인:</strong> {envInfo.hasCustomDomain ? "✅ 설정됨" : "❌ 미설정"}
            </div>
            <div>
              <strong>Vercel 배포:</strong> {envInfo.isVercelDeployment ? "✅ Vercel" : "❌ 로컬"}
            </div>
            <div>
              <strong>로컬 개발:</strong> {envInfo.isLocalDevelopment ? "✅ localhost" : "❌ 원격"}
            </div>
          </div>

          {/* URL 우선순위 표시 */}
          <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-800/30 rounded">
            <h3 className="font-semibold mb-2">🔄 URL 자동 감지 우선순위:</h3>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              <li className={envInfo.hasCustomDomain ? "text-green-600 font-bold" : ""}>
                NEXT_PUBLIC_SITE_URL (환경변수) {envInfo.hasCustomDomain && "← 현재 적용"}
              </li>
              <li className={envInfo.isVercelDeployment && !envInfo.hasCustomDomain ? "text-green-600 font-bold" : ""}>
                VERCEL_URL (Vercel 자동) {envInfo.isVercelDeployment && !envInfo.hasCustomDomain && "← 현재 적용"}
              </li>
              <li className={envInfo.isLocalDevelopment ? "text-green-600 font-bold" : ""}>
                localhost:3000 (개발환경) {envInfo.isLocalDevelopment && "← 현재 적용"}
              </li>
              <li>baseConfig.url (기본값)</li>
            </ol>
          </div>
        </section>

        {/* SEO 설정 */}
        <section className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-300">🔍 SEO 설정</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>제목:</strong> {seoConfig.title}
            </div>
            <div>
              <strong>설명:</strong> {seoConfig.description}
            </div>
            <div>
              <strong>URL:</strong> {seoConfig.url}
            </div>
            <div>
              <strong>OG 이미지:</strong> {seoConfig.ogImage}
            </div>
            <div>
              <strong>키워드 수:</strong> {seoConfig.keywords.split(", ").length}개
            </div>
            <div className="mt-3">
              <strong>키워드 목록:</strong>
              <div className="mt-2 flex flex-wrap gap-1">
                {seoConfig.keywords.split(", ").map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 사이트맵 미리보기 */}
        <section className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-300">🗺️ 사이트맵 미리보기</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>홈페이지:</strong> {envInfo.baseUrl}
            </div>
            <div>
              <strong>포스트 수:</strong> {posts.length}개
            </div>
            <div>
              <strong>카테고리 수:</strong> {categories.length}개
            </div>
            <div className="mt-4">
              <strong>주요 URL들:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>{envInfo.baseUrl}/sitemap.xml</li>
                <li>{envInfo.baseUrl}/robots.txt</li>
                <li>{envInfo.baseUrl}/rss.xml</li>
                {posts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    {envInfo.baseUrl}/post/{post.slug}
                  </li>
                ))}
                {categories.slice(0, 3).map((category) => (
                  <li key={category.id}>
                    {envInfo.baseUrl}/category/{category.slug}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 테스트 링크들 */}
        <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900 dark:text-yellow-300">🧪 테스트 링크</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">SEO 파일들:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="/sitemap.xml" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                    사이트맵 확인
                  </a>
                </li>
                <li>
                  <a href="/robots.txt" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                    Robots.txt 확인
                  </a>
                </li>
                <li>
                  <a href="/rss.xml" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                    RSS 피드 확인
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">외부 도구들:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(envInfo.baseUrl)}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    Google 리치 결과 테스트
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.facebook.com/sharing/debugger/?url=${encodeURIComponent(envInfo.baseUrl)}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    Facebook 디버거
                  </a>
                </li>
                <li>
                  <a
                    href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(envInfo.baseUrl)}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    Twitter 카드 검증
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 환경변수 정보 */}
        {debugInfo && (
          <section className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">⚙️ 환경변수</h2>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto">
              {JSON.stringify(debugInfo.envVars, null, 2)}
            </pre>
          </section>
        )}

        {/* 권장사항 */}
        <section className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-300">⚠️ 배포 전 체크리스트</h2>
          <ul className="space-y-2 text-sm">
            <li className={envInfo.hasCustomDomain ? "text-green-600" : "text-red-600"}>
              {envInfo.hasCustomDomain ? "✅" : "❌"} NEXT_PUBLIC_SITE_URL 환경변수 설정
            </li>
            <li className="text-gray-600">📝 /public/og-image.png 파일 추가 (1200x630px)</li>
            <li className="text-gray-600">📝 /public/favicon.ico, favicon.svg 파일 추가</li>
            <li className="text-gray-600">📝 Google Search Console 등록</li>
            <li className="text-gray-600">📝 Naver 웹마스터 도구 등록</li>
            <li className="text-blue-600">💡 도메인 변경 시 src/utils/site-config.ts의 baseConfig.url만 수정</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
