import type { Metadata } from "next"
import AdminGuard from "@/components/admin-guard"
import PostEditor from "@/components/admin/post-editor"

export const metadata: Metadata = {
  title: "새 포스트 작성",
  description: "새로운 블로그 포스트를 작성합니다.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewPostPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <PostEditor />
      </div>
    </AdminGuard>
  )
}
