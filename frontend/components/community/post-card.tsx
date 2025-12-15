"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Heart, TrendingUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { likePost, unlikePost } from "@/lib/actions/community"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    category: string | null
    image_url: string | null
    likes_count: number
    comments_count: number
    views_count: number
    created_at: string
    profiles?: {
      full_name: string | null
      role: string
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLiking) return

    setIsLiking(true)
    try {
      if (isLiked) {
        await unlikePost(post.id)
        setLikesCount((prev) => prev - 1)
      } else {
        await likePost(post.id)
        setLikesCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Failed to like/unlike post:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "question":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "tip":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "discussion":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "success_story":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Link href={`/community/post/${post.id}`}>
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                {post.profiles?.full_name || "Anonymous"}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                <Badge
                  variant="secondary"
                  className={
                    post.profiles?.role === "expert"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }
                >
                  {post.profiles?.role === "expert" ? "Expert" : "Farmer"}
                </Badge>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          {post.category && (
            <Badge className={getCategoryColor(post.category)} variant="secondary">
              {post.category.replace("_", " ")}
            </Badge>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{post.title}</h3>
        <p className="text-slate-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{post.content}</p>

        {/* Image */}
        {post.image_url && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image src={post.image_url || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{likesCount}</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">{post.comments_count}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{post.views_count}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  )
}
