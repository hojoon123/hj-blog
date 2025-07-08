import Link from "next/link"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
