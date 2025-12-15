"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Loader2,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Languages,
  Sparkles,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
// web-speech-api types are global in modern environments or can be polyfilled
// import type { SpeechRecognition } from "web-speech-api"
import { io, Socket } from "socket.io-client";

// Backend API URL from environment variable, defaults to localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
  hasImage?: boolean
}

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
]

export function KisaanMitraChatFloater({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "नमस्ते! मैं किसान मित्र हूं 🌾\n\nआपकी खेती से जुड़े किसी भी सवाल में मदद के लिए मैं यहां हूं। फसल, कीट, खाद, मौसम, या सरकारी योजनाओं के बारे में पूछें!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [language, setLanguage] = useState("hi")
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Initialize Socket and Speech Recognition (Cleanup Logic)
  useEffect(() => {
    // 1. Socket Connection
    socketRef.current = io(API_URL);

    // 2. Speech Recognition Setup
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "hi-IN"

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => prev + " " + transcript)
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    // CLEANUP FUNCTION (The Fix)
    return () => {
      // Clean Socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Clean Speech Recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      // Clean Speech Synthesis
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []); // Run once on mount

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined") return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    const hasHindi = /[\u0900-\u097F]/.test(text)
    utterance.lang = hasHindi ? "hi-IN" : "en-IN"
    utterance.rate = 0.9

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const loadingId = Date.now().toString() + "-loading"
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    try {
      // Build conversation history for context-aware responses
      const conversationHistory = messages
        .filter((m) => !m.isLoading && m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      // Add the new user message
      conversationHistory.push({
        role: "user",
        content: userMessage.content,
      })

      // Use frontend API route with multi-LLM fallback (Gemini → OpenRouter)
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      const responseText = data.message || data.error || "कुछ समस्या हुई। कृपया दोबारा कोशिश करें।"

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingId)
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: responseText,
            timestamp: new Date(),
          },
        ]
      })

      if (data.message && speechEnabled) {
        speakText(data.message)
      }
    } catch (error) {
      console.error("Chat error:", error)

      // Localized error messages based on selected language
      const errorMessages: Record<string, string> = {
        en: "Could not connect to server. Please try again.",
        hi: "सर्वर से संपर्क नहीं हो सका। कृपया दोबारा कोशिश करें।",
        ta: "சேவையகத்துடன் இணைக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        te: "సర్వర్‌కు కనెక్ట్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        kn: "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        ml: "സെർവറുമായി ബന്ധിപ്പിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
        mr: "सर्व्हरशी कनेक्ट होऊ शकले नाही. कृपया पुन्हा प्रयत्न करा.",
        gu: "સર્વર સાથે કનેક્ટ થઈ શક્યું નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.",
        bn: "সার্ভারের সাথে সংযোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        pa: "ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingId)
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: errorMessages[language] || errorMessages.hi,
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMessages: Record<string, string> = {
        en: "Please upload an image file (JPG, PNG, etc.)",
        hi: "कृपया एक छवि फ़ाइल अपलोड करें (JPG, PNG, आदि)",
      }
      alert(errorMessages[language] || errorMessages.hi)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const errorMessages: Record<string, string> = {
        en: "Image too large. Maximum size is 10MB.",
        hi: "छवि बहुत बड़ी है। अधिकतम आकार 10MB है।",
      }
      alert(errorMessages[language] || errorMessages.hi)
      return
    }

    setIsLoading(true)

    // Add user message indicating image upload
    const uploadMessages: Record<string, string> = {
      en: "📷 Uploaded plant image for analysis",
      hi: "📷 विश्लेषण के लिए पौधे की छवि अपलोड की गई",
      ta: "📷 பகுப்பாய்வுக்கு தாவர படம் பதிவேற்றப்பட்டது",
      te: "📷 విశ్లేషణ కోసం మొక్క చిత్రాన్ని అప్‌లోడ్ చేసారు",
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: uploadMessages[language] || uploadMessages.hi,
      timestamp: new Date(),
      hasImage: true,
    }
    setMessages((prev) => [...prev, userMessage])

    const loadingId = Date.now().toString() + "-loading"
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    try {
      // Convert image to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
      })
      reader.readAsDataURL(file)
      const imageBase64 = await base64Promise

      // Call the image analysis API
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          query: "Analyze this plant/crop image. Identify any diseases, pests, or health issues. Provide treatment recommendations for Indian farmers.",
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Image analysis failed")
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingId)
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.analysis || "विश्लेषण पूर्ण। कृपया दोबारा कोशिश करें।",
            timestamp: new Date(),
          },
        ]
      })

      if (data.analysis && speechEnabled) {
        speakText(data.analysis.substring(0, 500)) // Limit speech to first 500 chars
      }
    } catch (error) {
      console.error("Image analysis error:", error)

      const errorMessages: Record<string, string> = {
        en: "Failed to analyze image. Please try again.",
        hi: "छवि विश्लेषण विफल। कृपया दोबारा कोशिश करें।",
        ta: "படத்தை பகுப்பாய்வு செய்ய இயலவில்லை. மீண்டும் முயற்சிக்கவும்.",
        te: "చిత్రాన్ని విశ్లేషించడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingId)
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: errorMessages[language] || errorMessages.hi,
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleExit = () => {
    setIsOpen(false);
    // If used as a full page route, navigate back
    if (defaultOpen) {
      router.push("/community");
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 shadow-2xl animate-bounce hover:animate-none transition-all"
        size="icon"
      >
        <Sparkles className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
          AI
        </span>
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-50 shadow-2xl border-2 border-primary/30 transition-all duration-300 overflow-hidden bg-gradient-to-b from-background to-green-50/30 dark:to-green-950/10",
        isMinimized
          ? "bottom-24 right-4 md:bottom-6 md:right-6 w-80 h-16"
          : "bottom-24 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[420px] h-[75vh] md:h-[650px] max-h-[650px]",
        defaultOpen && "relative bottom-0 right-0 w-full h-full max-h-none md:w-full md:h-[80vh]" // Full page mode styles
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary via-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              किसान मित्र AI
              <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">Pro</span>
            </h3>
            <p className="text-xs opacity-90">Multilingual Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Languages className="h-5 w-5" />
          </Button>
          {!defaultOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
            onClick={handleExit}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border-b flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">भाषा / Language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 text-xs flex-1 bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 h-[calc(100%-12rem)]" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-green-600 text-white rounded-br-md"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-md",
                    )}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-gray-600 dark:text-gray-400">AI विश्लेषण कर रहा है...</span>
                      </div>
                    ) : (
                      <>
                        {message.hasImage && <ImageIcon className="h-4 w-4 inline mr-1 opacity-70" />}
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t bg-white dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Upload plant image for analysis"
              >
                <Camera className="h-5 w-5" />
              </Button>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="अपना सवाल लिखें... / Ask your question..."
                className="min-h-[44px] max-h-[100px] resize-none text-sm rounded-xl"
                rows={1}
                disabled={isLoading}
              />

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 flex-shrink-0 rounded-full transition-colors",
                  isListening ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-primary/10 hover:text-primary",
                )}
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-primary/10 transition-colors"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking()
                  } else {
                    setSpeechEnabled(!speechEnabled)
                  }
                }}
                title={speechEnabled ? "Voice output on" : "Voice output off"}
              >
                {isSpeaking ? (
                  <VolumeX className="h-5 w-5 text-primary" />
                ) : speechEnabled ? (
                  <Volume2 className="h-5 w-5 text-primary" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-400" />
                )}
              </Button>

              <Button
                size="icon"
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 shadow-md"
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                title="Send message"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>

            {isListening && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-xs text-red-600 font-medium">🎤 सुन रहा हूं... बोलिए!</p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
