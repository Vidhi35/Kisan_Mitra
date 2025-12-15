"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Camera, Home, Leaf } from "lucide-react"

interface DiagnosisResult {
  disease_name: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  symptoms: string
  treatment_recommendation: string
  crop_type: string
  additional_notes?: string
  image: string
  timestamp?: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get diagnosis result from sessionStorage
    const storedResult = sessionStorage.getItem("diagnosisResult")

    if (storedResult) {
      try {
        const data = JSON.parse(storedResult)
        setDiagnosis(data.data || data)
        console.log("[v0] Loaded diagnosis result:", data)
      } catch (error) {
        console.error("[v0] Failed to parse diagnosis result:", error)
        router.push("/camera")
      }
    } else {
      // No result found, redirect to camera
      router.push("/camera")
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!diagnosis) {
    return null
  }

  const isHealthy = diagnosis.disease_name.toLowerCase().includes("healthy")

  const severityConfig = {
    low: {
      color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      icon: CheckCircle,
      label: "Low Risk",
    },
    medium: {
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      icon: AlertTriangle,
      label: "Medium Risk",
    },
    high: {
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
      icon: AlertTriangle,
      label: "High Risk",
    },
    critical: {
      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      icon: AlertTriangle,
      label: "Critical",
    },
  }

  const config = severityConfig[diagnosis.severity] || severityConfig.medium
  const SeverityIcon = config.icon

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Diagnosis Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered plant disease analysis completed</p>
        </div>
      </div>

      {/* Main Result Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-full md:w-[320px] aspect-square rounded-xl overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
              <img
                src={diagnosis.image || "/placeholder.svg"}
                alt="Analyzed plant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Diagnosis Info */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Severity Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-full ${config.color} text-sm font-bold tracking-wider uppercase flex items-center gap-2`}
              >
                <SeverityIcon className="w-5 h-5" />
                {isHealthy ? "Healthy Plant" : config.label}
              </span>
            </div>

            {/* Disease Name */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {diagnosis.disease_name}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Leaf className="w-5 h-5" />
                <span className="font-medium">{diagnosis.crop_type}</span>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Confidence Score</p>
                  <p className={`font-bold text-xl ${isHealthy ? "text-green-600" : "text-orange-600"}`}>
                    {diagnosis.confidence}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${isHealthy ? "bg-green-500" : "bg-orange-500"}`}
                  style={{ width: `${diagnosis.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Symptoms Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Observed Symptoms
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{diagnosis.symptoms}</p>
      </Card>

      {/* Treatment Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {isHealthy ? "Maintenance Recommendations" : "Treatment Recommendations"}
        </h3>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-green-200 dark:border-green-700">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {diagnosis.treatment_recommendation}
          </p>
        </div>
      </Card>

      {/* Additional Notes */}
      {diagnosis.additional_notes && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{diagnosis.additional_notes}</p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.push("/camera")} size="lg" className="flex-1 gap-2 bg-primary hover:bg-[#25a25a]">
          <Camera className="w-5 h-5" />
          Analyze Another Plant
        </Button>
        <Button onClick={() => router.push("/dashboard")} variant="outline" size="lg" className="flex-1 gap-2">
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
