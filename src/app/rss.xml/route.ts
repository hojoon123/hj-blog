import { getPosts } from "@/lib/blog-service"
import { siteConfig } from "@/utils/site-config"

export async function GET() {
  const baseUrl = siteConfig.url

  try {
    const posts = await getPosts()
    const latestPosts = posts.slice(0, 20) // 최신 20개 포스트

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} - 코딩 강사의 개발 이야기</title>
    <description>${siteConfig.description}</description>
    <link>${baseUrl}</link>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${latestPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ""}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return new Response("Error generating RSS feed", { status: 500 })
  }
}
