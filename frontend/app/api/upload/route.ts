import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${type}/${timestamp}-${sanitizedName}`

    const supabase = await createClient()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("plant-images").upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("plant-images").getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (error) {
    console.error("Upload handler error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
