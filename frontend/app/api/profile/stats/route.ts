import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch plant scans count
    const { count: scansCount, error: scansError } = await supabase
      .from("plant_diagnoses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (scansError) {
      console.log("[v0] Plant diagnoses error:", scansError.message)
    }

    // Fetch community posts count
    const { count: postsCount, error: postsError } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId)

    if (postsError) {
      console.log("[v0] Community posts error:", postsError.message)
    }

    // Fetch farm records count
    const { count: recordsCount, error: recordsError } = await supabase
      .from("farm_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (recordsError) {
      console.log("[v0] Farm records error:", recordsError.message)
    }

    return NextResponse.json({
      scans: scansCount || 0,
      posts: postsCount || 0,
      records: recordsCount || 0,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ scans: 0, posts: 0, records: 0 })
  }
}
