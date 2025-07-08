export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  thumbnail_url?: string
  category_id?: string
  category?: Category | null
  author_id?: string
  published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface PostWithCategory extends Post {
  category: Category | null
}

// 포스트 에디터용 타입
export interface PostFormData {
  title: string
  content: string
  excerpt: string
  thumbnail_url: string
  category_id: string
  published: boolean
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PostsApiResponse {
  posts: PostWithCategory[]
}

export interface PostApiResponse {
  post: PostWithCategory
}

export interface CategoriesApiResponse {
  categories: Category[]
}

// 통계 타입
export interface StatsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  categoryStats: Record<string, number>
  recentPosts: Array<{
    id: string
    title: string
    created_at: string
    published: boolean
    view_count: number
    category: { name: string } | null
  }>
}

// 검색 결과 타입
export interface SearchResult {
  posts: PostWithCategory[]
  query: string
  count: number
}

// 에러 타입
export interface ApiError {
  error: string
  status?: number
}
