"use client"

import Link from "next/link"
import Image from "next/image"
import type { PostWithCategory } from "@/types/blog"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface PostCardProps {
  post: PostWithCategory
}

export default function PostCard({ post }: PostCardProps) {
  // 이미지 URL 처리 함수 - 최적화 개선
  const getImageSrc = (thumbnailUrl: string | undefined) => {
    if (!thumbnailUrl) {
      return "/api/placeholder?height=400&width=600"
    }

    if (thumbnailUrl.startsWith("/placeholder.svg")) {
      return `${thumbnailUrl}?height=400&width=600`
    }

    // Vercel Blob 이미지 최적화 - WebP 포맷 강제
    if (thumbnailUrl.includes("blob.vercel-storage.com")) {
      return `${thumbnailUrl}?w=600&h=400&fit=crop&auto=format,compress&q=75&fm=webp`
    }

    return thumbnailUrl
  }

  return (
    <article className="group cursor-pointer">
      <Link href={`/post/${post.slug}`}>
        <div className="space-y-4 bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200">
          {/* 썸네일 */}
          {post.thumbnail_url && (
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <Image
                src={getImageSrc(post.thumbnail_url) || "/placeholder.svg"}
                alt={post.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  // 이미지 로딩 실패 시 플레이스홀더로 대체
                  const target = e.target as HTMLImageElement
                  target.src = "/api/placeholder?height=400&width=600"
                }}
                priority={false}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAAAAAAAAAAAAAAAAAAAACv/EAB4QAAEEAgMBAAAAAAAAAAAAAAECAwQRBRIhMUFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAABAgMAEf/aAAwDAQACEQMRAD8A0XiyDI4jHzTRtJc1wBaQeQQdCCOhBGhWMkuqFmHvVMZpWn/Z"
              />
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
            )}

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-3">
                {post.category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                    {post.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.view_count}
                </span>
              </div>
              <time className="text-xs" dateTime={post.created_at}>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
