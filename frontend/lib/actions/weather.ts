"use server"

import { createClient } from "@/lib/supabase/server"

export async function getWeatherAlerts(location?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("weather_alerts")
    .select("*")
    .eq("is_active", true)
    .order("severity", { ascending: false })
    .order("start_date", { ascending: false })

  if (location) {
    query = query.ilike("location", `%${location}%`)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data }
}
