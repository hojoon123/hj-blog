import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase.from("categories").select("name").limit(3)

    const { data: posts, error: postError } = await supabase.from("posts").select("title, published").limit(3)

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        categories: {
          connected: !catError,
          count: categories?.length || 0,
        },
        posts: {
          connected: !postError,
          count: posts?.length || 0,
          published: posts?.filter((p) => p.published).length || 0,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
