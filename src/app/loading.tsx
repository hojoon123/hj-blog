export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* 히어로 섹션 스켈레톤 */}
        <section className="text-center py-12 mb-12">
          <div className="h-12 bg-gray-200 rounded-lg mb-4 max-w-2xl mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded-lg max-w-xl mx-auto"></div>
        </section>

        {/* 포스트 그리드 스켈레톤 */}
        <section>
          <div className="h-8 bg-gray-200 rounded-lg mb-8 max-w-xs"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[16/10] bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
