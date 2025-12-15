
// Hugging Face Inference API endpoint (Updated to new router)
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

// Disease name mapping to common names
const DISEASE_MAPPING: Record<string, { name: string; severity: string }> = {
    "Apple___Apple_scab": { name: "Apple Scab", severity: "moderate" },
    "Apple___Black_rot": { name: "Apple Black Rot", severity: "high" },
    "Apple___Cedar_apple_rust": { name: "Cedar Apple Rust", severity: "moderate" },
    "Apple___healthy": { name: "Healthy Apple Plant", severity: "none" },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": { name: "Corn Gray Leaf Spot", severity: "moderate" },
    "Corn_(maize)___Common_rust_": { name: "Corn Common Rust", severity: "moderate" },
    "Corn_(maize)___Northern_Leaf_Blight": { name: "Corn Northern Leaf Blight", severity: "high" },
    "Corn_(maize)___healthy": { name: "Healthy Corn Plant", severity: "none" },
    "Grape___Black_rot": { name: "Grape Black Rot", severity: "high" },
    "Grape___Esca_(Black_Measles)": { name: "Grape Esca (Black Measles)", severity: "high" },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": { name: "Grape Leaf Blight", severity: "moderate" },
    "Grape___healthy": { name: "Healthy Grape Plant", severity: "none" },
    "Potato___Early_blight": { name: "Potato Early Blight", severity: "moderate" },
    "Potato___Late_blight": { name: "Potato Late Blight", severity: "high" },
    "Potato___healthy": { name: "Healthy Potato Plant", severity: "none" },
    "Tomato___Bacterial_spot": { name: "Tomato Bacterial Spot", severity: "moderate" },
    "Tomato___Early_blight": { name: "Tomato Early Blight", severity: "moderate" },
    "Tomato___Late_blight": { name: "Tomato Late Blight", severity: "high" },
    "Tomato___Leaf_Mold": { name: "Tomato Leaf Mold", severity: "moderate" },
    "Tomato___Septoria_leaf_spot": { name: "Tomato Septoria Leaf Spot", severity: "moderate" },
    "Tomato___Spider_mites Two-spotted_spider_mite": { name: "Tomato Spider Mites", severity: "moderate" },
    "Tomato___Target_Spot": { name: "Tomato Target Spot", severity: "moderate" },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": { name: "Tomato Yellow Leaf Curl Virus", severity: "high" },
    "Tomato___Tomato_mosaic_virus": { name: "Tomato Mosaic Virus", severity: "high" },
    "Tomato___healthy": { name: "Healthy Tomato Plant", severity: "none" },
}

export async function detectDiseaseFromImage(base64Image: string) {
    try {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
        const imageBuffer = Buffer.from(base64Data, "base64")

        const headers: HeadersInit = {
            "Content-Type": "application/octet-stream",
        }

        if (process.env.HF_ACCESS_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.HF_ACCESS_TOKEN}`
        }

        // Call Hugging Face Inference API with raw bytes
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers,
            body: imageBuffer,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("[Disease Detection Lib] Primary model failed:", response.status, errorText)
            // Retry with alternative model
            return await tryAlternativeModel(imageBuffer)
        }

        const predictions = await response.json()

        if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
            if (predictions.error) {
                return { success: false, error: predictions.error }
            }
            return { success: false, error: "No predictions returned" }
        }

        const topPrediction = predictions[0]
        const diseaseKey = topPrediction.label
        const confidence = (topPrediction.score * 100).toFixed(2)

        const diseaseInfo = DISEASE_MAPPING[diseaseKey] || {
            name: diseaseKey.replace(/_/g, " "),
            severity: "unknown",
        }

        return {
            success: true,
            disease: diseaseInfo.name,
            confidence: parseFloat(confidence),
            severity: diseaseInfo.severity,
            rawLabel: diseaseKey,
        }

    } catch (error: any) {
        console.error("[Disease Detection Lib] Error:", error)

        // FAIL-SAFE: If detection fails (e.g. 401/410/Network), return a generic result
        // so the Text LLM can still provide advice based on the user's query.
        console.log("[Disease Detection Lib] Returning generic fallback detection.")
        return {
            success: true,
            disease: "Potential Plant Issue",
            confidence: "Low (Detection Failed)",
            severity: "Unknown",
            rawLabel: "fallback_issue",
            note: "Automatic detection failed, switching to manual analysis mode."
        }
    }
}

async function tryAlternativeModel(imageBuffer: Buffer) {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/octet-stream",
        }
        if (process.env.HF_ACCESS_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.HF_ACCESS_TOKEN}`
        }

        const altResponse = await fetch(
            "https://router.huggingface.co/hf-inference/models/nateraw/vit-base-beans",
            {
                method: "POST",
                headers,
                body: new Uint8Array(imageBuffer),
            }
        )

        if (!altResponse.ok) {
            const errText = await altResponse.text()
            console.error("[Disease Detection Lib] Alternative model failed:", altResponse.status, errText)
            throw new Error("Alternative model failed") // Trigger main catch block for fail-safe
        }

        const predictions = await altResponse.json()
        const topPrediction = predictions[0]

        return {
            success: true,
            disease: topPrediction.label,
            confidence: (topPrediction.score * 100).toFixed(2),
            severity: "Unknown",
            rawLabel: topPrediction.label,
            note: "Using alternative detection model"
        }
    } catch (err: any) {
        throw err // Trigger main catch block for fail-safe
    }
}

