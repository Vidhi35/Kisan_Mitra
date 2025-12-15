/**
 * Perplexity AI Integration
 * Provides real-time search capabilities for agricultural information
 * Docs: https://docs.perplexity.ai/guides/search-guide
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

if (!PERPLEXITY_API_KEY) {
  console.warn("[Perplexity] API key not configured. Set PERPLEXITY_API_KEY in environment variables.")
}

export interface PerplexityMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface PerplexityResponse {
  id: string
  model: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Query Perplexity AI for real-time information
 * Best for: Government schemes, agricultural news, market prices, weather updates
 */
export async function queryPerplexity(query: string, language = "en", systemPrompt?: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key not configured")
  }

  const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    mr: "Marathi",
    gu: "Gujarati",
    bn: "Bengali",
    pa: "Punjabi",
    or: "Odia",
    as: "Assamese",
  }

  const defaultSystemPrompt = `You are an expert agricultural assistant for Indian farmers. Provide accurate, practical, and actionable information about farming, government schemes, crops, diseases, market prices, and weather. Always cite official sources when available. Respond in ${languageNames[language] || "English"} language. Keep responses clear and farmer-friendly.`

  const messages: PerplexityMessage[] = [
    {
      role: "system",
      content: systemPrompt || defaultSystemPrompt,
    },
    {
      role: "user",
      content: query,
    },
  ]

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online", // Best for factual searches
        messages,
        max_tokens: 1500,
        temperature: 0.2, // Lower temperature for factual accuracy
        top_p: 0.9,
        search_domain_filter: ["gov.in", "nic.in"], // Prioritize Indian government sources
        return_citations: true,
        search_recency_filter: "month", // Recent information
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Perplexity API error: ${response.status} - ${error}`)
    }

    const data: PerplexityResponse = await response.json()
    return data.choices[0]?.message?.content || "No response received"
  } catch (error) {
    console.error("[Perplexity] Query failed:", error)
    throw error
  }
}

/**
 * Query government scheme details
 */
export async function getSchemeDetails(schemeName: string, language = "hi"): Promise<string> {
  const query = `Provide detailed information about the "${schemeName}" government scheme for Indian farmers in 2025-2026. Include:
1. Eligibility criteria
2. Application procedure (step-by-step)
3. Subsidy/benefit amount
4. MSP (Minimum Support Price) if applicable
5. Official website and helpline
6. Documents required
Format the response clearly with sections.`

  const systemPrompt = `You are a government schemes expert for Indian farmers. Provide accurate, official information about agricultural schemes. Always cite official government sources. Respond in ${language === "hi" ? "Hindi" : language === "en" ? "English" : "the requested Indian language"}.`

  return await queryPerplexity(query, language, systemPrompt)
}

/**
 * Get latest agricultural news for India
 */
export async function getAgriculturalNews(language = "en"): Promise<string> {
  const query = `Latest agricultural news in India (December 2025): rice harvest projections, government policies, MSP updates, crop production, farming technology trends. Provide 5-7 recent news items with dates.`

  return await queryPerplexity(query, language)
}

/**
 * Get crop market prices
 */
export async function getMarketPrices(cropName: string, state = "India", language = "hi"): Promise<string> {
  const query = `Current market price (mandi bhav) for ${cropName} in ${state}, India in December 2025. Include MSP if applicable, and recent price trends.`

  return await queryPerplexity(query, language)
}
