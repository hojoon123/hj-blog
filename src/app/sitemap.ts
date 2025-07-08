import { getPosts, getCategories } from "@/lib/blog-service"
import { siteConfig } from "@/utils/site-config"

export default async function sitemap() {
  const baseUrl = siteConfig.url

  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()])

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      ...postUrls,
      ...categoryUrls,
    ]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
    ]
  }
}
