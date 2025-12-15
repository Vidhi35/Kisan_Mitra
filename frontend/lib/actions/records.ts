"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"

export async function createRecord(data: {
  record_type: "planting" | "irrigation" | "fertilizer" | "pesticide" | "harvest" | "expense" | "income" | "other"
  crop_name?: string
  description: string
  quantity?: number
  unit?: string
  cost?: number
  date?: string
  notes?: string
}) {
  const supabase = createAdminClient()

  const { data: record, error } = await supabase
    .from("farm_records")
    .insert({
      user_id: MOCK_USER_ID,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Create record error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/records")
  return { data: record }
}

export async function getRecords(
  userId: string,
  filters?: {
    record_type?: string
    start_date?: string
    end_date?: string
  },
  limit = 50,
) {
  const supabase = createAdminClient()

  let query = supabase
    .from("farm_records")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit)

  if (filters?.record_type) {
    query = query.eq("record_type", filters.record_type)
  }

  if (filters?.start_date) {
    query = query.gte("date", filters.start_date)
  }

  if (filters?.end_date) {
    query = query.lte("date", filters.end_date)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Get records error:", error.message)
    return { data: [], error: error.message }
  }

  return { data: data || [] }
}

export async function updateRecord(
  id: string,
  updates: Partial<{
    record_type: string
    crop_name: string
    description: string
    quantity: number
    unit: string
    cost: number
    date: string
    notes: string
  }>,
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("farm_records").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Update record error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/records")
  return { data }
}

export async function deleteRecord(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("farm_records").delete().eq("id", id)

  if (error) {
    console.error("[v0] Delete record error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/records")
  return { success: true }
}

export async function getRecordsSummary(userId: string, month?: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("farm_records").select("record_type, cost").eq("user_id", userId)

  if (error) {
    console.error("[v0] Get records summary error:", error.message)
    return { data: { total_expenses: 0, total_income: 0, by_type: {} }, error: error.message }
  }

  const summary = {
    total_expenses: 0,
    total_income: 0,
    by_type: {} as Record<string, number>,
  }

  data?.forEach((record) => {
    if (record.record_type === "expense") {
      summary.total_expenses += record.cost || 0
    } else if (record.record_type === "income") {
      summary.total_income += record.cost || 0
    }

    if (!summary.by_type[record.record_type]) {
      summary.by_type[record.record_type] = 0
    }
    summary.by_type[record.record_type] += record.cost || 0
  })

  return { data: summary }
}

export async function getFarmRecords(limit = 50) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("farm_records")
    .select("*")
    .eq("user_id", MOCK_USER_ID)
    .order("date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Get farm records error:", error.message)
    return { data: [], error: error.message }
  }

  return { data: data || [] }
}

export async function createFarmRecord(data: {
  activity_type: string
  crop_name: string
  description: string
  date: string
}) {
  const supabase = createAdminClient()

  const { data: record, error } = await supabase
    .from("farm_records")
    .insert({
      user_id: MOCK_USER_ID,
      record_type: data.activity_type,
      crop_name: data.crop_name,
      description: data.description,
      date: data.date,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Create farm record error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/records")
  return { data: record }
}
