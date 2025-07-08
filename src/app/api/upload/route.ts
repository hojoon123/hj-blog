import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { generateSlug } from "@/utils/slug-generator"

// Slug 기반 폴더 구조 생성
function generateFileName(originalName: string, postSlug?: string, isContent = false): string {
  const timestamp = Date.now()
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_")

  if (postSlug) {
    // 특정 포스트의 이미지: posts/post-slug/filename
    const prefix = isContent ? "content" : "thumbnail"
    return `posts/${postSlug}/${prefix}_${timestamp}_${cleanName}`
  } else {
    // 임시 이미지 (slug가 없는 경우): temp/date/filename
    const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    return `temp/${date}/content_${timestamp}_${cleanName}`
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("업로드 API 호출됨")

    // 관리자 권한 확인
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("인증 실패: 사용자 없음")
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    if (!adminEmails.includes(user.email || "")) {
      console.error("권한 실패:", user.email)
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const postTitle = formData.get("postTitle") as string | null
    const isContent = formData.get("isContent") === "true"

    console.log("업로드 파라미터:", {
      fileName: file?.name,
      fileSize: file?.size,
      postTitle,
      isContent,
    })

    if (!file) {
      console.error("파일 없음")
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("파일 크기 초과:", file.size)
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일 타입 검증
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error("지원하지 않는 파일 타입:", file.type)
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 })
    }

    // 제목을 slug로 변환
    let postSlug: string | undefined
    if (postTitle && postTitle.trim()) {
      postSlug = generateSlug(postTitle.trim())
      console.log(`제목 "${postTitle}" → slug "${postSlug}"`)
    }

    // Slug 기반 파일명 생성
    const fileName = generateFileName(file.name, postSlug, isContent)
    console.log("생성된 파일명:", fileName)

    // Vercel Blob에 업로드
    console.log("Vercel Blob 업로드 시작...")
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("업로드 성공:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: fileName,
      size: file.size,
      type: file.type,
      folder: fileName.split("/").slice(0, -1).join("/"),
      postSlug: postSlug,
      isContent: isContent,
    })
  } catch (error) {
    console.error("업로드 API 전체 에러:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
    return NextResponse.json(
      {
        error: `파일 업로드 중 오류가 발생했습니다: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
