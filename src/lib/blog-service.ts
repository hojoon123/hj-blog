import { createClient } from "@/utils/supabase/server"
import type { Category, PostWithCategory } from "@/types/blog"

export async function getPosts(categorySlug?: string): Promise<PostWithCategory[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("posts")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (categorySlug) {
      const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      } else {
        return []
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching posts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching posts:", error)
    return []
  }
}

export async function getPost(slug: string): Promise<PostWithCategory | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Error fetching post:", error)
      return null
    }

    // 조회수 증가
    try {
      await supabase
        .from("posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id)
    } catch (updateError) {
      console.warn("Failed to update view count:", updateError)
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching post:", error)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching categories:", error)
    return []
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<PostWithCategory[]> {
  return getPosts(categorySlug)
}
