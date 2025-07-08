import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// 포스트에서 사용된 모든 이미지 URL 추출
function extractAllImageUrls(content: string, thumbnailUrl?: string): string[] {
  const urls: string[] = []

  // 썸네일 URL 추가
  if (thumbnailUrl && thumbnailUrl.includes("blob.vercel-storage.com")) {
    urls.push(thumbnailUrl)
  }

  if (!content || typeof content !== "string") {
    return urls
  }

  // 다양한 마크다운 이미지 패턴들
  const imagePatterns = [
    // 기본 마크다운: ![alt](url)
    /!\[([^\]]*)\]$$([^)]+)$$/g,
    // 참조 스타일: ![alt][ref] 후에 [ref]: url
    /!\[([^\]]*)\]\[([^\]]+)\]/g,
    // HTML img 태그: <img src="url">
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
    // 직접 URL (blob.vercel-storage.com 포함)
    /(https:\/\/[^\s]+blob\.vercel-storage\.com\/[^\s)]+)/g,
  ]

  imagePatterns.forEach((pattern, index) => {
    let match
    pattern.lastIndex = 0

    while ((match = pattern.exec(content)) !== null) {
      let url = ""

      // 패턴에 따라 URL 추출
      if (index === 0 || index === 1) {
        url = match[2]?.trim()
      } else if (index === 2) {
        url = match[1]?.trim()
      } else if (index === 3) {
        url = match[1]?.trim()
      }

      // Vercel Blob URL인지 확인하고 추가
      if (url && url.includes("blob.vercel-storage.com") && !urls.includes(url)) {
        urls.push(url)
      }
    }
  })

  // 중복 제거 및 유효한 URL만 필터링
  const uniqueUrls = [...new Set(urls)].filter((url) => {
    return url.startsWith("https://") && url.includes("blob.vercel-storage.com")
  })

  return uniqueUrls
}

// Vercel Blob에서 이미지 삭제
async function deleteImagesFromBlob(
  imageUrls: string[],
): Promise<{ success: number; failed: number; details: string[] }> {
  let success = 0
  let failed = 0
  const details: string[] = []

  for (const url of imageUrls) {
    try {
      await del(url)
      details.push(`✅ 성공: ${url}`)
      success++
    } catch (error) {
      details.push(`❌ 실패: ${url} (${error})`)
      failed++
    }
  }

  return { success, failed, details }
}

// 포스트 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

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

    // 서비스 롤로 포스트 조회 (이미지 URL 추출용)
    const adminClient = createAdminClient()

    const { data: existingPost, error: fetchError } = await adminClient
      .from("posts")
      .select("id, title, slug, content, thumbnail_url")
      .eq("id", id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 })
    }

    // 포스트에서 사용된 모든 이미지 URL들 추출
    const imageUrls = extractAllImageUrls(existingPost.content, existingPost.thumbnail_url)

    // 포스트 삭제
    const { error: deleteError } = await adminClient.from("posts").delete().eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: "포스트 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 관련 이미지들을 Vercel Blob에서 삭제
    let imageDeleteResult = { success: 0, failed: 0, details: [] as string[] }
    if (imageUrls.length > 0) {
      imageDeleteResult = await deleteImagesFromBlob(imageUrls)
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
      postTitle: existingPost.title,
      postSlug: existingPost.slug,
      totalImages: imageUrls.length,
      deletedImages: imageDeleteResult.success,
      failedImages: imageDeleteResult.failed,
      imageDetails: imageDeleteResult.details,
      message: `포스트 "${existingPost.title}"이 삭제되었습니다. 이미지 ${imageDeleteResult.success}/${imageUrls.length}개 삭제 완료.`,
    })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json({ error: "포스트 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 포스트 상태 변경
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { published } = body

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

    const adminClient = createAdminClient()
    const { error, data } = await adminClient.from("posts").update({ published }).eq("id", id).select()

    if (error) {
      return NextResponse.json({ error: "포스트 상태 변경 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: data })
  } catch (error) {
    console.error("Update API error:", error)
    return NextResponse.json({ error: "포스트 상태 변경 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 포스트 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

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

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("posts")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error("Get post API error:", error)
    return NextResponse.json({ error: "포스트 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 포스트 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, thumbnail_url, category_id, published } = body

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

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다." }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from("posts")
      .update({
        title,
        content,
        excerpt: excerpt || content.slice(0, 200) + "...",
        thumbnail_url,
        category_id: category_id || null,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: "포스트 업데이트 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error("Update post API error:", error)
    return NextResponse.json({ error: "포스트 업데이트 중 오류가 발생했습니다." }, { status: 500 })
  }
}
