import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { analyzeImageWithGemini } from "@/lib/ai/gemini"
import { analyzeImageWithAmazonNova } from "@/lib/ai/openrouter"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"

const DIAGNOSIS_PROMPT = `You are an expert agricultural pathologist and plant disease specialist for Indian farmers. Analyze this plant leaf image carefully and provide a detailed diagnosis.

You MUST respond ONLY with valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "disease_name": "Name of the disease in English and Hindi, or 'Healthy / स्वस्थ' if no disease",
  "confidence": <number between 0-100>,
  "severity": "low" | "medium" | "high" | "critical",
  "symptoms": "Description of visible symptoms in both English and Hindi",
  "treatment_recommendation": "Detailed treatment and prevention steps. Include organic and chemical options. Write in both English and Hindi.",
  "crop_type": "Type of crop/plant identified",
  "additional_notes": "Any additional observations, prevention tips, or recommendations for the farmer"
}

Be specific and practical. Indian farmers need actionable advice they can use immediately. Include local treatment options available in India.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Starting plant diagnosis with Gemini...")

    let aiResponse = await analyzeImageWithGemini(image, DIAGNOSIS_PROMPT)

    if (!aiResponse.success || !aiResponse.text) {
      console.log("[v0] Gemini failed, trying Amazon Nova fallback...")
      aiResponse = await analyzeImageWithAmazonNova(image, DIAGNOSIS_PROMPT)
    }

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 })
    }

    console.log("[v0] AI diagnosis complete")

    // Parse the JSON response
    let diagnosisData
    try {
      const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        diagnosisData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response, using fallback")
      diagnosisData = {
        disease_name: "Analysis Complete / विश्लेषण पूर्ण",
        confidence: 70,
        severity: "medium",
        symptoms: aiResponse.text.substring(0, 300),
        treatment_recommendation: aiResponse.text,
        crop_type: "Unknown / अज्ञात",
        additional_notes: "Please consult a local agricultural expert for confirmation.",
      }
    }

    // Save to database
    const supabase = createAdminClient()
    const { data: diagnosis, error: dbError } = await supabase
      .from("plant_diagnoses")
      .insert({
        user_id: MOCK_USER_ID,
        image_url: image.substring(0, 100) + "...",
        disease_name: diagnosisData.disease_name,
        confidence: Math.min(diagnosisData.confidence / 100, 1),
        symptoms: diagnosisData.symptoms,
        treatment_recommendation: diagnosisData.treatment_recommendation,
        severity: diagnosisData.severity,
        crop_type: diagnosisData.crop_type,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError.message)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: diagnosis?.id || "temp-" + Date.now(),
        ...diagnosisData,
        image_url: image,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
