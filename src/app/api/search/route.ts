import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ posts: [], query: "" })
    }

    const supabase = await createClient()

    // 제목과 내용에서 검색 (대소문자 구분 없음)
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("published", true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      posts: data || [],
      query: query.trim(),
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 })
  }
}
