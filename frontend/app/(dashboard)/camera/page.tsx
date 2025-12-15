"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, RefreshCw, Languages, MessageSquare, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MarkdownRenderer } from "@/components/markdown-renderer"

// Indian language options
const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
]

// Default queries in different languages
const DEFAULT_QUERIES: Record<string, string> = {
  en: "What disease or problem do you see in this plant? Please provide detailed analysis and treatment recommendations.",
  hi: "इस पौधे में आपको क्या बीमारी या समस्या दिख रही है? कृपया विस्तृत विश्लेषण और उपचार की सिफारिशें प्रदान करें।",
  ta: "இந்த செடியில் என்ன நோய் அல்லது பிரச்சனை தெரிகிறது? விரிவான பகுப்பாய்வு மற்றும் சிகிச்சை பரிந்துரைகளை வழங்கவும்.",
  te: "ఈ మొక్కలో మీరు ఏ వ్యాధి లేదా సమస్యను చూస్తున్నారు? దయచేసి వివరణాత్మక విశ్లేషణ మరియు చికిత్స సిఫార్సులను అందించండి.",
  kn: "ಈ ಸಸ್ಯದಲ್ಲಿ ನೀವು ಯಾವ ರೋಗ ಅಥವಾ ಸಮಸ್ಯೆಯನ್ನು ನೋಡುತ್ತೀರಿ? ದಯವಿಟ್ಟು ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸುಗಳನ್ನು ಒದಗಿಸಿ.",
  ml: "ഈ ചെടിയിൽ നിങ്ങൾ എന്ത് രോഗമോ പ്രശ്നമോ കാണുന്നു? വിശദമായ വിശകലനവും ചികിത്സാ നിർദ്ദേശങ്ങളും നൽകുക.",
  mr: "या झाडामध्ये तुम्हाला कोणता रोग किंवा समस्या दिसत आहे? कृपया तपशीलवार विश्लेषण आणि उपचार शिफारसी प्रदान करा.",
  gu: "આ છોડમાં તમે કયો રોગ અથવા સમસ્યા જુઓ છો? કૃપા કરીને વિગતવાર વિશ્લેષણ અને સારવારની ભલામણો પ્રદાન કરો.",
  bn: "এই গাছে আপনি কোন রোগ বা সমস্যা দেখছেন? বিস্তারিত বিশ্লেষণ এবং চিকিৎসার পরামর্শ প্রদান করুন।",
  pa: "ਇਸ ਪੌਦੇ ਵਿੱਚ ਤੁਸੀਂ ਕੀ ਬੀਮਾਰੀ ਜਾਂ ਸਮੱਸਿਆ ਦੇਖਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਵਿਸਤ੍ਰਿਤ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਇਲਾਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਦਾਨ ਕਰੋ।",
  or: "ଏହି ଉଦ୍ଭିଦରେ ଆପଣ କେଉଁ ରୋଗ ବା ସମସ୍ୟା ଦେଖୁଛନ୍ତି? ଦୟାକରି ବିସ୍ତୃତ ବିଶ୍ଳେଷଣ ଏବଂ ଚିକିତ୍ସା ସୁପାରିଶ ପ୍ରଦାନ କରନ୍ତୁ।",
  as: "এই গছত আপুনি কি ৰোগ বা সমস্যা দেখিছে? বিস্তৃত বিশ্লেষণ আৰু চিকিৎসাৰ পৰামৰ্শ প্ৰদান কৰক।",
}

export default function CameraScreen() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const [query, setQuery] = useState(DEFAULT_QUERIES.en)
  const [language, setLanguage] = useState("en")
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  useEffect(() => {
    startWebcam()
    return () => {
      stopWebcam()
    }
  }, [])

  useEffect(() => {
    setQuery(DEFAULT_QUERIES[language] || DEFAULT_QUERIES.en)
  }, [language])

  const startWebcam = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      console.error("[v0] Webcam access error:", err)
      setError("Could not access camera. Please check permissions or upload an image instead.")
      setCameraActive(false)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        setPreviewSrc(imageDataUrl)
        stopWebcam()
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string)
        stopWebcam()
      }
      reader.onerror = () => {
        setError("Failed to read file")
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!previewSrc) return
    if (!query.trim()) {
      setError("Please enter your question about the plant")
      return
    }

    setIsProcessing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      console.log("[v0] Sending image for AI analysis...")
      console.log("[v0] Query:", query)
      console.log("[v0] Language:", language)

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: previewSrc,
          query: query.trim(),
          language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // If we have partial results (disease detected but LLM failed)
        if (response.status === 503 && errorData.detectedDisease) {
          const severityEmoji = errorData.severity === "high" ? "🔴" : errorData.severity === "moderate" ? "🟡" : "🟢"
          let fallbackResult = `${severityEmoji} **DETECTED: ${errorData.detectedDisease}**\n`
          fallbackResult += `Confidence: ${errorData.confidence}% | Severity: ${errorData.severity}\n\n`
          fallbackResult += `⚠️ ${errorData.message || "AI Analysis unavailable due to high traffic."}`

          setAnalysisResult(fallbackResult)
          return // Exit without throwing error
        }

        throw new Error(errorData.message || errorData.error || "Failed to analyze image")
      }

      const result = await response.json()
      console.log("[v0] AI analysis result:", result)

      // Format the result with disease detection info
      let formattedAnalysis = ""

      if (result.detectedDisease) {
        const severityEmoji = result.severity === "high" ? "🔴" : result.severity === "moderate" ? "🟡" : "🟢"
        formattedAnalysis = `${severityEmoji} **DETECTED: ${result.detectedDisease}**\n`
        formattedAnalysis += `Confidence: ${result.confidence}% | Severity: ${result.severity}\n`
        formattedAnalysis += `Model: ${result.mlModel}\n\n`
        formattedAnalysis += `---\n\n${result.analysis}`
      } else {
        formattedAnalysis = result.analysis
      }

      setAnalysisResult(formattedAnalysis)
    } catch (err) {
      console.error("[v0] Analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetCapture = () => {
    setPreviewSrc(null)
    setError(null)
    setAnalysisResult(null)
    startWebcam()
  }

  return (
    <div className="flex flex-col items-center justify-start p-4 md:p-8 w-full max-w-6xl mx-auto gap-6 min-h-screen">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">AI Plant Doctor</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Google Gemini AI</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload a plant image and ask your question in your preferred language. Our AI will provide detailed analysis
          and recommendations.
        </p>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        {/* Left side: Camera/Image */}
        <div className="space-y-4">
          {/* Camera/Preview Container */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg ring-1 ring-gray-900/5">
            {!previewSrc ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan Frame Overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg"></div>
                    </div>
                  </div>
                )}

                {!cameraActive && !error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <RefreshCw className="w-12 h-12 mx-auto mb-2 animate-spin" />
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img
                src={previewSrc || "/placeholder.svg"}
                alt="Captured plant"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex flex-col items-center gap-4">
            {!previewSrc ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {cameraActive && (
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="h-20 w-20 rounded-full bg-primary hover:bg-[#25a25a] transition-colors shadow-lg border-4 border-gray-100"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </Button>
                )}

                <div className="flex flex-col items-center gap-2 flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </Button>
                  {!cameraActive && (
                    <Button onClick={startWebcam} variant="ghost" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" />
                      Try Camera Again
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button
                onClick={resetCapture}
                disabled={isProcessing}
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent w-full"
              >
                <X className="w-5 h-5" />
                Retake Photo
              </Button>
            )}
          </div>
        </div>

        {/* Right side: Query and Analysis */}
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-primary/20">
            <Label htmlFor="language" className="flex items-center gap-2 mb-2 font-semibold">
              <Languages className="w-4 h-4" />
              Select Language / भाषा चुनें
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <Label htmlFor="query" className="flex items-center gap-2 mb-2 font-semibold">
              <MessageSquare className="w-4 h-4" />
              Your Question / आपका सवाल
            </Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the plant..."
              className="min-h-[120px] text-sm"
              disabled={!previewSrc || isProcessing}
            />
            <p className="text-xs text-gray-500 mt-2">
              Example: What disease is this? How to treat it? What nutrients are missing?
            </p>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="p-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </Card>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeImage}
            disabled={isProcessing || !previewSrc || !query.trim()}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 gap-2 h-14 text-base"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze with AI
              </>
            )}
          </Button>

          {analysisResult && (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-primary/20 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/10">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">AI Analysis Result</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Kisaan Mitra AI</p>
                </div>
              </div>

              <MarkdownRenderer content={analysisResult} />

              <div className="mt-6 pt-4 border-t border-primary/10 text-center">
                <p className="text-xs text-gray-500 italic">
                  Disclaimer: This analysis is generated by AI. Always consult with a local agricultural expert for verification.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Card className="w-full max-w-5xl p-6 bg-blue-50 dark:bg-blue-900/20">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Tips for Best Results:
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li>Ensure the diseased area or plant part is clearly visible in the image</li>
          <li>Use good lighting for better AI analysis accuracy</li>
          <li>Write specific questions for more targeted advice</li>
          <li>Select your preferred language for responses</li>
          <li>The AI understands all Indian languages including Hindi, Tamil, Telugu, and more</li>
        </ul>
      </Card>
    </div>
  )
}
