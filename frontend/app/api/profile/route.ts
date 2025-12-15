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

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

    if (error) {
      console.error("Profile fetch error:", error.message)
      // Return empty profile instead of error
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ profile: null })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, full_name, phone, location, farm_size } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

    let profile
    let error

    if (existing) {
      // Update existing profile
      const result = await supabase
        .from("profiles")
        .update({
          full_name,
          phone,
          location,
          farm_size,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      profile = result.data
      error = result.error
    } else {
      // Create new profile (upsert)
      const result = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name,
          phone,
          location,
          farm_size,
          role: "farmer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      profile = result.data
      error = result.error
    }

    if (error) {
      console.error("Profile update error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Profile update API error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
