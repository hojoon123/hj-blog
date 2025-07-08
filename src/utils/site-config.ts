interface SiteConfig {
  url: string
  name: string
  description: string
  author: string
  social: {
    twitter?: string
    github?: string
    email?: string
  }
  seo: {
    keywords: string[]
    ogImage: string
  }
}

const isDevelopment = process.env.NODE_ENV === "development"
const isProduction = process.env.NODE_ENV === "production"

// 환경별 기본 설정
const baseConfig: SiteConfig = {
  name: "호준의 정보과학",
  description:
    "정보과학 교육 전문가의 실무 경험과 강의 노하우를 바탕으로 한 개발 지식을 공유합니다. Python, JavaScript, 정보과학 교육 전문.",
  author: "호준",
  social: {
    github: "https://github.com/your-username",
    email: "rhzn5512@naver.com",
  },
  seo: {
    keywords: [
      // 기본 개발 키워드
      "개발",
      "프로그래밍",
      "코딩",
      "JavaScript",
      "React",
      "Next.js",
      "웹개발",
      "튜토리얼",
      "강의",
      "기술블로그",
      // Python 관련
      "Python",
      "파이썬",
      "파이썬 강의",
      "파이썬 튜토리얼",
      // 정보과학 교육 관련 - 호준님 전문 분야
      "정보과학",
      "정보교육",
      "중등정보",
      "고등정보",
      "중딩정보수업",
      "고딩정보수업",
      "정보과학 교사",
      "코딩교육",
      "프로그래밍 교육",
      "컴퓨터과학",
      "알고리즘",
      "자료구조",
      "호준",
      "호준의 정보과학",
      // 교육 관련
      "온라인강의",
      "코딩강사",
      "프로그래밍강사",
      "IT교육",
      "소프트웨어교육",
    ],
    ogImage: "/og-image.png",
  },
  // 🎯 프로덕션 기본 도메인
  url: "https://hojun-information-science.co.kr",
}

// 🔥 핵심! 환경별 URL 자동 감지 함수
const getBaseUrl = (): string => {
  // 🏠 개발 환경이면 무조건 localhost
  if (isDevelopment) {
    return "http://localhost:3000"
  }

  // 🚀 프로덕션 환경에서는 우선순위 적용
  // 1. 환경변수에서 명시적으로 설정된 경우 (최우선)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 2. Vercel 배포 환경 (미리보기 배포)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 3. 기본값 (프로덕션 도메인)
  return baseConfig.url
}

export const siteConfig: SiteConfig = {
  ...baseConfig,
  url: getBaseUrl(), // 🎯 여기서 환경에 따라 자동 결정!
}

// SEO 헬퍼 함수들
export const getSeoConfig = () => ({
  title: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  ogImage: `${siteConfig.url}${siteConfig.seo.ogImage}`,
  keywords: siteConfig.seo.keywords.join(", "),
})

// 환경 정보 확인
export const getEnvironmentInfo = () => ({
  isDevelopment,
  isProduction,
  nodeEnv: process.env.NODE_ENV,
  baseUrl: siteConfig.url,
  hasCustomDomain: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  isVercelDeployment: Boolean(process.env.VERCEL_URL),
  isLocalDevelopment: isDevelopment && siteConfig.url.includes("localhost"),
  domainReady: siteConfig.url.includes("hojun-information-science.co.kr"),
})

// 디버그 정보 (개발 환경에서만)
export const getDebugInfo = () => {
  if (!isDevelopment) return null

  return {
    environment: getEnvironmentInfo(),
    siteConfig,
    envVars: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    urlLogic: [
      "🏠 개발환경 (NODE_ENV=development): localhost:3000 강제",
      "🚀 프로덕션 (NODE_ENV=production):",
      "  1. NEXT_PUBLIC_SITE_URL 환경변수 우선",
      "  2. VERCEL_URL (미리보기 배포)",
      "  3. 기본값: hojun-information-science.co.kr",
    ],
    currentResult: `현재 URL: ${siteConfig.url}`,
  }
}

// 전체 프로젝트에서 사용할 URL 헬퍼
export const getFullUrl = (path = ""): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${siteConfig.url}${cleanPath}`
}

// 이미지 URL 헬퍼
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) return imagePath
  return getFullUrl(imagePath)
}
