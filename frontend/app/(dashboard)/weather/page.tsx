"use client"

import { useState, useEffect } from "react"
import { Wind, Droplets, Gauge, AlertTriangle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WeatherData {
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    uvi: number
    visibility: number
    pressure: number
    weather: Array<{ description: string; icon: string }>
    rain?: { "1h": number }
  }
  hourly: Array<{
    dt: number
    temp: number
    weather: Array<{ description: string; icon: string }>
    pop: number
  }>
  daily: Array<{
    dt: number
    temp: { min: number; max: number }
    weather: Array<{ description: string; icon: string }>
    pop: number
  }>
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState({ lat: 0, lon: 0, city: "Your Location" })
  const [searchCity, setSearchCity] = useState("")

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setLocation({ lat: latitude, lon: longitude, city: "Detecting..." })
          await fetchWeather(latitude, longitude)
        },
        () => {
          // Default to Delhi if location access denied
          setLocation({ lat: 28.6139, lon: 77.209, city: "Delhi" })
          fetchWeather(28.6139, 77.209)
        },
      )
    } else {
      setLocation({ lat: 28.6139, lon: 77.209, city: "Delhi" })
      fetchWeather(28.6139, 77.209)
    }
  }, [])

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError(null)

      // Using Open-Meteo API (free, no key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`,
      )

      if (!response.ok) throw new Error("Failed to fetch weather data")

      const data = await response.json()

      // Transform to match our interface
      const transformedData: WeatherData = {
        current: {
          temp: data.current.temperature_2m,
          feels_like: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          wind_speed: data.current.wind_speed_10m,
          uvi: 0,
          visibility: 10000,
          pressure: data.current.pressure_msl,
          weather: [{ description: getWeatherDescription(data.current.weather_code), icon: "" }],
          rain: data.current.rain ? { "1h": data.current.rain } : undefined,
        },
        hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
          dt: new Date(time).getTime() / 1000,
          temp: data.hourly.temperature_2m[i],
          weather: [{ description: getWeatherDescription(data.hourly.weather_code[i]), icon: "" }],
          pop: data.hourly.precipitation_probability[i],
        })),
        daily: data.daily.time.slice(0, 7).map((time: string, i: number) => ({
          dt: new Date(time).getTime() / 1000,
          temp: { min: data.daily.temperature_2m_min[i], max: data.daily.temperature_2m_max[i] },
          weather: [{ description: getWeatherDescription(data.daily.weather_code[i]), icon: "" }],
          pop: data.daily.precipitation_probability_max[i],
        })),
      }

      setWeather(transformedData)

      // Get city name
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`,
      )
      const geoData = await geoResponse.json()
      if (geoData.results?.[0]) {
        setLocation((prev) => ({ ...prev, city: geoData.results[0].name || geoData.results[0].admin1 }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather")
    } finally {
      setLoading(false)
    }
  }

  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    }
    return weatherCodes[code] || "Unknown"
  }

  const getAdvisory = () => {
    if (!weather) return []
    const advice: string[] = []
    const current = weather.current

    if (current.wind_speed > 20) {
      advice.push(
        "⚠️ High winds detected. Avoid pesticide/fertilizer spraying (best between 6-10 AM with winds < 10 km/h).",
      )
    }
    if (current.humidity > 80) {
      advice.push("💧 High humidity. Monitor crops for fungal diseases. Improve air circulation.")
    }
    if (current.rain && current.rain["1h"] > 0) {
      advice.push("🌧️ Rain detected. Postpone irrigation and field operations.")
    }
    if (weather.daily[0].pop > 70) {
      advice.push("☔ High chance of rain today. Plan indoor activities and secure equipment.")
    }
    if (current.temp > 35) {
      advice.push("🌡️ High temperature. Ensure adequate irrigation and monitor for heat stress.")
    }
    if (current.temp < 10) {
      advice.push("❄️ Cold temperature. Protect sensitive crops from frost damage.")
    }

    return advice
  }

  const handleSearchCity = async () => {
    if (!searchCity.trim()) return

    try {
      setLoading(true)
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=en&format=json`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        setLocation({ lat: result.latitude, lon: result.longitude, city: result.name })
        await fetchWeather(result.latitude, result.longitude)
      } else {
        setError("City not found")
      }
    } catch (err) {
      setError("Failed to search city")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !weather) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header with location search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Weather Forecast</h1>
            <p className="text-slate-600 dark:text-slate-400">{location.city}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchCity()}
            className="w-full sm:w-64"
          />
          <Button onClick={handleSearchCity}>Search</Button>
        </div>
      </div>

      {weather && (
        <>
          {/* Current Weather Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-7xl font-black text-slate-900 dark:text-white">
                    {Math.round(weather.current.temp)}°C
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                      {weather.current.weather[0].description}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Feels like {Math.round(weather.current.feels_like)}°C
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-500">Humidity</p>
                      <p className="font-bold">{weather.current.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Wind</p>
                      <p className="font-bold">{Math.round(weather.current.wind_speed)} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Pressure</p>
                      <p className="font-bold">{Math.round(weather.current.pressure)} hPa</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farming Advisory */}
          {getAdvisory().length > 0 && (
            <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-lg font-bold">Farming Advisory</AlertTitle>
              <AlertDescription>
                <ul className="space-y-2 mt-2">
                  {getAdvisory().map((advice, i) => (
                    <li key={i} className="text-sm">
                      {advice}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Hourly Forecast */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2">
                  {weather.hourly.slice(0, 12).map((hour, i) => (
                    <div key={i} className="text-center min-w-[80px] flex-shrink-0">
                      <p className="text-sm text-slate-500 mb-2">{new Date(hour.dt * 1000).getHours()}:00</p>
                      <p className="text-2xl font-bold mb-1">{Math.round(hour.temp)}°</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                        {hour.weather[0].description}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">{hour.pop}% rain</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weather.daily.map((day, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <p className="font-medium w-24">
                        {i === 0 ? "Today" : new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 capitalize flex-1">
                        {day.weather[0].description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-blue-600">{day.pop}% rain</p>
                      <div className="flex gap-2 min-w-[100px] justify-end">
                        <span className="font-bold">{Math.round(day.temp.max)}°</span>
                        <span className="text-slate-500">{Math.round(day.temp.min)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
