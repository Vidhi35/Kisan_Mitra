import { type NextRequest, NextResponse } from "next/server"
import { chatWithGemini } from "@/lib/ai/gemini"
import { chatWithAmazonNova } from "@/lib/ai/openrouter"

const KISAAN_MITRA_SYSTEM_PROMPT = `You are "Kisaan Mitra" (किसान मित्र) - a friendly, knowledgeable AI assistant dedicated to helping Indian farmers succeed.

Your expertise includes:
- Crop selection and profitable farming decisions
- Pest and disease identification and treatment
- Fertilizer and pesticide recommendations
- Weather-based farming advice
- Government schemes and subsidies for farmers (PM-KISAN, crop insurance, etc.)
- Solar-dried products and value addition opportunities
- Organic farming techniques
- Market prices and best selling practices
- Irrigation and water management
- Soil health and nutrient management

CRITICAL GUIDELINES:
1. ALWAYS respond ONLY in the language specified by the user. Do NOT mix languages.
2. If the user specifies Hindi, write your ENTIRE response in Hindi. If English, then ONLY English.
3. Support all Indian languages: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi
4. Be warm, respectful, and use simple language farmers can understand
5. Give practical, actionable advice with step-by-step instructions
6. Include approximate costs when discussing products/inputs
7. Mention local/organic alternatives when available
8. Be encouraging and supportive - farming is hard work!
9. If unsure, recommend consulting local Krishi Vigyan Kendra (KVK) or agricultural officer
10. Use emojis occasionally to make conversations friendly: 🌾 🌱 🚜 💧 🌞

Remember: You are talking to hardworking farmers who feed the nation. Treat them with utmost respect and provide helpful, practical advice.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, language = "hi" } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 })
    }

    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
      kn: "Kannada (ಕನ್ನಡ)",
      ml: "Malayalam (മലയാളം)",
      mr: "Marathi (मराठी)",
      gu: "Gujarati (ગુજરાતી)",
      bn: "Bengali (বাংলা)",
      pa: "Punjabi (ਪੰਜਾਬੀ)",
      or: "Odia (ଓଡ଼ିଆ)",
      as: "Assamese (অসমীয়া)",
    }

    const languageName = languageMap[language] || "English"
    const enhancedPrompt = `${KISAAN_MITRA_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: The user has selected ${languageName} language. You MUST respond ENTIRELY in ${languageName}. Do NOT use any other language. Every single word must be in ${languageName}.`

    let aiResponse = await chatWithGemini(messages, enhancedPrompt)

    if (!aiResponse.success || !aiResponse.text) {
      // Format messages for OpenRouter
      const openRouterMessages = [
        { role: "system" as const, content: enhancedPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ]

      aiResponse = await chatWithAmazonNova(openRouterMessages)
    }

    if (!aiResponse.success || !aiResponse.text) {
      const errorMessages: Record<string, string> = {
        en: "Sorry, something went wrong. Please try again.",
        hi: "माफ करें, कुछ समस्या हुई। कृपया दोबारा कोशिश करें।",
        ta: "மன்னிக்கவும், ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
        te: "క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
        kn: "ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        ml: "ക്ഷമിക്കണം, എന്തോ തെറ്റ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",
        mr: "माफ करा, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
        gu: "માફ કરશો, કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
        bn: "দুঃখিত, কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        pa: "ਮਾਫ਼ ਕਰੋ, ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        or: "କ୍ଷମା କରନ୍ତୁ, କିଛି ଭୁଲ୍ ହୋଇଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।",
        as: "ক্ষমা কৰক, কিবা ভুল হৈছে। অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।",
      }

      return NextResponse.json({ error: errorMessages[language] || errorMessages.en }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: aiResponse.text,
      language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Assistant API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
