"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink, Loader2, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Scheme {
  id: number
  name: string
  fullName: string
  desc: string
  subsidy: string
  msp: string
  category: string
  eligibility: string
  website: string
}

export default function GovernmentSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [schemeDetails, setSchemeDetails] = useState("")
  const [language, setLanguage] = useState("hi")
  const [loading, setLoading] = useState(false)
  const [newsLoading, setNewsLoading] = useState(false)
  const [news, setNews] = useState("")

  // Fetch schemes list
  useEffect(() => {
    fetch("/api/schemes/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchemes(data.data)
          setFilteredSchemes(data.data)
        }
      })
      .catch(console.error)
  }, [])

  // Fetch agricultural news
  useEffect(() => {
    setNewsLoading(true)
    fetch(`/api/news?language=${language}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNews(data.data.content)
        }
      })
      .catch(console.error)
      .finally(() => setNewsLoading(false))
  }, [language])

  // Filter schemes based on search
  useEffect(() => {
    const filtered = schemes.filter(
      (scheme) =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.desc.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSchemes(filtered)
  }, [searchTerm, schemes])

  // Fetch scheme details from Perplexity AI
  const handleSchemeSelect = async (scheme: Scheme) => {
    setSelectedScheme(scheme)
    setSchemeDetails("")
    setLoading(true)

    try {
      const response = await fetch("/api/schemes/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeName: scheme.fullName, language }),
      })

      const data = await response.json()
      if (data.success) {
        setSchemeDetails(data.data.details)
      } else {
        setSchemeDetails("Failed to fetch scheme details. Please try again.")
      }
    } catch (error) {
      setSchemeDetails("Error fetching scheme details. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-8 py-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          सरकारी योजनाएं / Government Schemes
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Find and apply for agricultural schemes and subsidies</p>
      </div>

      {/* Language Selector */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language:</span>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Schemes List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search schemes (e.g., PM-KISAN, insurance, irrigation)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Schemes Grid */}
          <div className="grid gap-4">
            {filteredSchemes.map((scheme) => (
              <Card
                key={scheme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedScheme?.id === scheme.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSchemeSelect(scheme)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{scheme.name}</CardTitle>
                      <CardDescription className="text-xs mb-2">{scheme.fullName}</CardDescription>
                    </div>
                    <Badge variant="secondary">{scheme.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{scheme.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Subsidy:</span>
                      <p className="font-semibold text-green-600 dark:text-green-400">{scheme.subsidy}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">MSP:</span>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{scheme.msp}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Eligible: {scheme.eligibility}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`https://${scheme.website}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scheme Details Panel */}
          {selectedScheme && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Detailed Information: {selectedScheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3">Fetching latest information...</span>
                  </div>
                ) : schemeDetails ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{schemeDetails}</div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      Click on a scheme to view detailed application procedure and eligibility
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* News Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Latest Agricultural News
              </CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : news ? (
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{news}</div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No news available</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Contact Kisan Call Center:</p>
              <p className="font-bold text-lg">1800-180-1551</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Available 24/7 in multiple Indian languages</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
