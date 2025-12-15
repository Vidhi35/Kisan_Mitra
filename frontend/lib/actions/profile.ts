"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string
    phone?: string
    location?: string
    farm_size?: number
  },
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { data }
}
