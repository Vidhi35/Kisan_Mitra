"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { User, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { addComment } from "@/lib/actions/community"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles?: {
    full_name: string | null
    role: string
  } | null
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addComment(postId, newComment.trim())

      if (result.error) {
        throw new Error(result.error)
      }

      setNewComment("")
      toast({
        title: "Comment added!",
        description: "Your comment has been posted",
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast({
        title: "Failed to add comment",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Comments ({comments.length})</h2>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder="Share your thoughts or advice..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="mb-3 resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {comment.profiles?.full_name || "Anonymous"}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      comment.profiles?.role === "expert"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 text-xs"
                    }
                  >
                    {comment.profiles?.role === "expert" ? "Expert" : "Farmer"}
                  </Badge>
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
