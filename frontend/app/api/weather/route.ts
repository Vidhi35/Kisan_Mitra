import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Mumbai"

    // TODO: Integrate with actual weather API (OpenWeatherMap, WeatherAPI, etc.)
    // For now, return mock data
    const mockWeather = {
      location,
      temperature: 28,
      humidity: 65,
      condition: "Partly Cloudy",
      wind_speed: 12,
      precipitation: 10,
      forecast: [
        { day: "Mon", temp: 29, condition: "Sunny", rain: 0 },
        { day: "Tue", temp: 27, condition: "Cloudy", rain: 20 },
        { day: "Wed", temp: 26, condition: "Rainy", rain: 80 },
        { day: "Thu", temp: 28, condition: "Partly Cloudy", rain: 30 },
        { day: "Fri", temp: 30, condition: "Sunny", rain: 0 },
      ],
    }

    return NextResponse.json({ data: mockWeather })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
