import type { MetadataRoute } from "next"
import { siteConfig } from "@/utils/site-config"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/debug/", "/*.json$", "/manifest.json", "/browserconfig.xml"],
      },
      // 검색엔진 봇 허용
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/debug/"],
      },
      // AI 봇 차단 (선택적)
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
