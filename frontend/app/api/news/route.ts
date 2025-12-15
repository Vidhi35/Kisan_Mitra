import { NextResponse } from "next/server"
import { getAgriculturalNews } from "@/lib/ai/perplexity"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "en"

    // Fetch latest agricultural news using Perplexity AI
    const newsContent = await getAgriculturalNews(language)

    // Parse the response into structured news items
    // In production, this could be cached with Redis for 1 hour
    return NextResponse.json({
      success: true,
      data: {
        content: newsContent,
        language,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[News API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch news",
      },
      { status: 500 },
    )
  }
}
