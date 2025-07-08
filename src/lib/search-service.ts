import type { PostWithCategory } from "@/types/blog"

interface SearchResult {
  posts: PostWithCategory[]
  query: string
  count: number
}

export async function searchPosts(query: string): Promise<SearchResult> {
  if (!query || query.trim().length < 2) {
    return { posts: [], query: "", count: 0 }
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error("Search failed")
    }
    return await response.json()
  } catch (error) {
    console.error("Search error:", error)
    return { posts: [], query, count: 0 }
  }
}
