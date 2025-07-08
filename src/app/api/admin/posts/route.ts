import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import { generateUniqueSlug } from "@/utils/slug-generator"

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

    // 서비스 롤로 모든 포스트 조회
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("posts")
      .select(`
        *,
        category:categories(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "포스트 조회 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ posts: data || [] })
  } catch (error) {
    console.error("Posts API error:", error)
    return NextResponse.json({ error: "포스트 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 새 포스트 생성
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, content, excerpt, thumbnail_url, category_id, published = false } = body

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다." }, { status: 400 })
    }

    // 슬러그 생성 (제목을 기반으로)
    const adminClient = createAdminClient()

    // 슬러그 중복 확인 함수
    const checkSlugExists = async (slug: string): Promise<boolean> => {
      const { data } = await adminClient.from("posts").select("slug").eq("slug", slug).single()
      return !!data
    }

    // 고유 슬러그 생성
    const finalSlug = await generateUniqueSlug(title, checkSlugExists)

    // 포스트 생성
    const { data, error } = await adminClient
      .from("posts")
      .insert({
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || content.slice(0, 200) + "...",
        thumbnail_url,
        category_id: category_id || null,
        author_id: user.id,
        published,
      })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: "포스트 생성 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error("Create post API error:", error)
    return NextResponse.json({ error: "포스트 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}
