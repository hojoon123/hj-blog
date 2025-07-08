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

    // 서비스 롤로 카테고리 조회
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.from("categories").select("*").order("name")

    if (error) {
      return NextResponse.json({ error: "카테고리 조회 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ categories: data || [] })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "카테고리 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
