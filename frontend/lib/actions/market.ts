"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function getMarketRates(
  filters?: {
    crop_name?: string
    market_location?: string
    state?: string
  },
  limit = 50,
) {
  const supabase = createAdminClient()

  try {
    let query = supabase.from("market_rates").select("*").order("date", { ascending: false }).limit(limit)

    if (filters?.crop_name) {
      query = query.ilike("crop_name", `%${filters.crop_name}%`)
    }

    if (filters?.market_location) {
      query = query.ilike("market_location", `%${filters.market_location}%`)
    }

    if (filters?.state) {
      query = query.eq("state", filters.state)
    }

    const { data, error } = await query

    if (error) {
      console.log("[v0] Market rates table not ready:", error.message)
      return { data: [] }
    }

    return { data: data || [] }
  } catch (err) {
    console.log("[v0] Error fetching market rates:", err)
    return { data: [] }
  }
}

export async function getCropPriceHistory(cropName: string, days = 30) {
  const supabase = createAdminClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("market_rates")
    .select("*")
    .eq("crop_name", cropName)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (error) {
    console.error("[v0] Get crop price history error:", error.message)
    return { data: [], error: error.message }
  }

  return { data: data || [] }
}
