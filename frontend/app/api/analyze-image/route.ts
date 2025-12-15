import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { detectDiseaseFromImage } from "@/lib/disease-detection"

export const runtime = "nodejs"
export const maxDuration = 60

// Language mapping for Indian languages
const LANGUAGE_MAP: Record<string, string> = {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, query, language = "en" } = body

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const languageName = LANGUAGE_MAP[language] || "English"

    // Extract base64 (just for validation/logging if needed)
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }
    // const base64Data = matches[2] // ML function extracts this itself

    // ==========================================
    // STEP 1: Detect Disease using Pre-trained Model (Hugging Face)
    // ==========================================
    console.log("[v2] Step 1: Detect disease with ML model...")
    let diseaseDetection
    try {
      diseaseDetection = await detectDiseaseFromImage(image)
    } catch (e) {
      console.error("[v2] Detection failed:", e)
      // Manual fallback object if library throws
      diseaseDetection = { success: false, disease: "Unknown", confidence: "0", severity: "Unknown", rawLabel: "error" }
    }

    // Log detection result
    if (diseaseDetection && diseaseDetection.success) {
      console.log("[v2] Disease detected:", diseaseDetection.disease, `(${diseaseDetection.confidence}%)`)
    } else {
      console.log("[v2] Disease detection returned unsuccessful:", (diseaseDetection as any)?.error)
      if (!diseaseDetection) {
        diseaseDetection = { success: false, disease: "Unknown", confidence: "0", severity: "Unknown", rawLabel: "error" }
      }
    }

    // ==========================================
    // STEP 2: Generate Advice using Groq (Llama 3)
    // ==========================================
    console.log("[v2] Step 2: Generating advice with Groq (Llama 3)...")

    const groqApiKey = process.env.GROQ_API_KEY
    let analysis = ""

    if (!groqApiKey) {
      console.warn("[v2] Warning: GROQ_API_KEY is missing. Returning placeholder.")
      analysis = `
## System Configuration Required

**API Key Missing:**
Please add your Groq API Key to the \`.env\` file as \`GROQ_API_KEY\`.

**Detected Condition:** ${diseaseDetection?.disease || "Unknown"}
(Confidence: ${diseaseDetection?.confidence || "0"}%)

**To Fix:**
1. Get a free API Key from [console.groq.com](https://console.groq.com)
2. Open \`.env\` file in the project root
3. Add: \`GROQ_API_KEY=your_key_here\`
4. Restart the server
`
    } else {
      try {
        let systemPrompt = ""
        let userPrompt = ""

        // Construct Prompts based on detection
        if (diseaseDetection.success && diseaseDetection.disease && diseaseDetection.disease !== "Potential Plant Issue" && diseaseDetection.disease !== "Unknown") {
          systemPrompt = `You are "Kisaan Mitra", an expert agricultural AI assistant. 
                 A user has detected the plant disease "${diseaseDetection.disease}" (Confidence: ${diseaseDetection.confidence}%).
                 
                 Your task: Provide a detailed, helpful response in Markdown format.
                 Structure:
                 1. **Confirmation**: Briefly confirm the disease.
                 2. **Symptoms**: What to look for.
                 3. **Causes**: Common causes.
                 4. **Treatment**: Organic & Chemical options.
                 5. **Prevention**: Future prevention.
                 6. **Disclaimer**: Consult local expert.`

          userPrompt = `User Query: "${query}". Language: ${languageName}. Please provide detailed advice for ${diseaseDetection.disease}.`
        } else {
          // Fallback if detection failed or user query is generic
          systemPrompt = `You are "Kisaan Mitra", an expert agricultural AI assistant. 
                 The user has uploaded a plant image but specific disease detection was inconclusive.
                 Provide general plant health advice based on the user's query.`

          userPrompt = `User Query: "${query}". Language: ${languageName}. Please provide helpful agricultural advice based on this.`
        }

        // Call Groq API
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Powerful Free Model on Groq
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        })

        if (!groqResponse.ok) {
          const errText = await groqResponse.text()
          throw new Error(`Groq API failed: ${groqResponse.status} ${errText}`)
        }

        const groqData = await groqResponse.json()
        analysis = groqData.choices[0]?.message?.content || "No analysis generated."

      } catch (groqError: any) {
        console.error("[v2] Groq Error:", groqError)
        analysis = `
## AI Analysis Error

We encountered an error while generating your advice.

**Error Details:** ${groqError.message}

**Detected Condition:** ${diseaseDetection?.disease || "Unknown"}

Please try again in a few moments.
`
      }
    }

    // ==========================================
    // STEP 3: Return Response
    // ==========================================
    return NextResponse.json({
      success: true,
      analysis,
      detectedDisease: diseaseDetection?.disease || "Unknown",
      confidence: diseaseDetection?.confidence || "0",
      severity: diseaseDetection?.severity || "Unknown",
      query,
      language,
      languageName,
      provider: "groq-llama3",
      mlModel: "MobileNetV2+Router",
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error("Error analyzing image:", error)
    return NextResponse.json(
      { error: "Failed to analyze image: " + error.message },
      { status: 500 }
    )
  }
}
