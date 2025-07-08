import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 관리자 권한 확인
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 })
    }

    // 서비스 롤로 통계 조회
    const adminClient = createAdminClient()

    const { count: totalPosts } = await adminClient.from("posts").select("*", { count: "exact", head: true })
    const { count: publishedPosts } = await adminClient
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true)
    const { count: draftPosts } = await adminClient
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("published", false)

    const { data: viewData } = await adminClient.from("posts").select("view_count")
    const totalViews = viewData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

    const { data: categoryStats } = await adminClient
      .from("posts")
      .select(`
        category_id,
        category:categories(name)
      `)
      .eq("published", true)

    const categoryCount: Record<string, number> = {}
    if (categoryStats) {
      categoryStats.forEach((post) => {
        let categoryName = "미분류"
        if (post.category && typeof post.category === "object" && "name" in post.category) {
          categoryName = (post.category as { name: string }).name
        }
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
      })
    }

    const { data: recentPosts } = await adminClient
      .from("posts")
      .select(`
        id,
        title,
        created_at,
        published,
        view_count,
        category:categories(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      draftPosts: draftPosts || 0,
      totalViews,
      categoryStats: categoryCount,
      recentPosts: recentPosts || [],
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "통계 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
