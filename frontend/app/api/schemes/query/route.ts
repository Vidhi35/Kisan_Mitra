import { type NextRequest, NextResponse } from "next/server"
import { getSchemeDetails } from "@/lib/ai/perplexity"

export async function POST(request: NextRequest) {
  try {
    const { schemeName, language = "hi" } = await request.json()

    if (!schemeName) {
      return NextResponse.json({ success: false, error: "Scheme name is required" }, { status: 400 })
    }

    // Query Perplexity AI for real-time scheme details
    const details = await getSchemeDetails(schemeName, language)

    return NextResponse.json({
      success: true,
      data: {
        schemeName,
        language,
        details,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[Scheme Query API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch scheme details",
      },
      { status: 500 },
    )
  }
}
