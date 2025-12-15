"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"

export async function createPost(data: {
  title: string
  content: string
  category?: "question" | "tip" | "discussion" | "success_story"
  tags?: string[]
  image_url?: string
}) {
  const supabase = createAdminClient()

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: MOCK_USER_ID,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Create post error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/community")
  return { data: post }
}

export async function getPosts(limit = 20, offset = 0) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        profiles:author_id (
          full_name,
          role
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.log("[v0] Community posts fetch error:", error.message)
      return { data: [] }
    }

    return { data: data || [] }
  } catch (err) {
    console.log("[v0] Error fetching posts:", err)
    return { data: [] }
  }
}

export async function getPostById(postId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("community_posts")
    .select(`
      *,
      profiles:author_id (
        full_name,
        role
      )
    `)
    .eq("id", postId)
    .single()

  if (error) {
    console.error("[v0] Get post error:", error.message)
    return { error: error.message }
  }

  // Increment views
  await supabase
    .from("community_posts")
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq("id", postId)

  return { data }
}

export async function likePost(postId: string) {
  const supabase = createAdminClient()

  // Check if already liked
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", MOCK_USER_ID)
    .maybeSingle()

  if (existing) {
    return { error: "Already liked" }
  }

  const { error: likeError } = await supabase.from("post_likes").insert({ post_id: postId, user_id: MOCK_USER_ID })

  if (likeError) {
    console.error("[v0] Like post error:", likeError.message)
    return { error: likeError.message }
  }

  // Update likes count on post
  const { data: post } = await supabase.from("community_posts").select("likes_count").eq("id", postId).single()

  if (post) {
    await supabase
      .from("community_posts")
      .update({ likes_count: (post.likes_count || 0) + 1 })
      .eq("id", postId)
  }

  revalidatePath("/community")
  return { success: true }
}

export async function unlikePost(postId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", MOCK_USER_ID)

  if (error) {
    console.error("[v0] Unlike post error:", error.message)
    return { error: error.message }
  }

  // Update likes count on post
  const { data: post } = await supabase.from("community_posts").select("likes_count").eq("id", postId).single()

  if (post && post.likes_count > 0) {
    await supabase
      .from("community_posts")
      .update({ likes_count: post.likes_count - 1 })
      .eq("id", postId)
  }

  revalidatePath("/community")
  return { success: true }
}

export async function addComment(postId: string, content: string) {
  const supabase = createAdminClient()

  const { data: comment, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      author_id: MOCK_USER_ID,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Add comment error:", error.message)
    return { error: error.message }
  }

  // Update comments count on post
  const { data: post } = await supabase.from("community_posts").select("comments_count").eq("id", postId).single()

  if (post) {
    await supabase
      .from("community_posts")
      .update({ comments_count: (post.comments_count || 0) + 1 })
      .eq("id", postId)
  }

  revalidatePath(`/community/post/${postId}`)
  return { data: comment }
}

export async function getComments(postId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("post_comments")
    .select(`
      *,
      profiles:author_id (
        full_name,
        role
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Get comments error:", error.message)
    return { error: error.message }
  }

  return { data: data || [] }
}
