// OpenRouter AI integration (Amazon Nova fallback)
// Secondary AI when Gemini fails

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

export interface OpenRouterResponse {
  success: boolean
  text?: string
  error?: string
}

export async function chatWithAmazonNova(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
): Promise<OpenRouterResponse> {
  try {
    if (!OPENROUTER_API_KEY) {
      return { success: false, error: "OpenRouter API key not configured" }
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://plantdoctor.app",
        "X-Title": "PlantDoctor Kisaan Mitra",
      },
      body: JSON.stringify({
        model: "amazon/nova-2-lite-v1:free",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenRouter API error:", errorData)
      return { success: false, error: errorData.error?.message || "OpenRouter API failed" }
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      return { success: false, error: "No response from Amazon Nova" }
    }

    return { success: true, text }
  } catch (error) {
    console.error("[v0] OpenRouter error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function analyzeImageWithAmazonNova(imageBase64: string, prompt: string): Promise<OpenRouterResponse> {
  try {
    if (!OPENROUTER_API_KEY) {
      return { success: false, error: "OpenRouter API key not configured" }
    }

    // Format image for OpenRouter vision
    const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://plantdoctor.app",
        "X-Title": "PlantDoctor Kisaan Mitra",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free", // Free vision model on OpenRouter
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenRouter vision error:", errorData)
      return { success: false, error: errorData.error?.message || "OpenRouter vision failed" }
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      return { success: false, error: "No response from vision model" }
    }

    return { success: true, text }
  } catch (error) {
    console.error("[v0] OpenRouter vision error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
