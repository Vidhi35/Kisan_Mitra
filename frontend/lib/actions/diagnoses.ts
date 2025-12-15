"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"

export async function createDiagnosis(data: {
  image_url: string
  disease_name?: string
  confidence?: number
  symptoms?: string
  treatment_recommendation?: string
  severity?: "low" | "medium" | "high" | "critical"
  crop_type?: string
}) {
  const supabase = createAdminClient()

  const { data: diagnosis, error } = await supabase
    .from("plant_diagnoses")
    .insert({
      user_id: MOCK_USER_ID,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Create diagnosis error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/camera")
  return { data: diagnosis }
}

export async function getDiagnoses(userId: string, limit = 10) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("plant_diagnoses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Get diagnoses error:", error.message)
    return { data: [], error: error.message }
  }

  return { data: data || [] }
}

export async function getDiagnosisById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("plant_diagnoses").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[v0] Get diagnosis error:", error.message)
    return { error: error.message }
  }

  return { data }
}
