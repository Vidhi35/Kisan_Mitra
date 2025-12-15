import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, User, MessageCircle, Heart, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPostById, getComments } from "@/lib/actions/community"
import { CommentSection } from "@/components/community/comment-section"
import { ExpertChatButton } from "@/components/community/expert-chat-button"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params
  const postResult = await getPostById(id)
  const commentsResult = await getComments(id)

  if (postResult.error || !postResult.data) {
    notFound()
  }

  const post = postResult.data
  const comments = commentsResult.data || []

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
    <div className="max-w-[900px] mx-auto w-full px-4 md:px-8 py-6 pb-24">
      {/* Back button */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Community
      </Link>

      {/* Post */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {post.profiles?.full_name || "Anonymous"}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{post.title}</h1>
        <p className="text-slate-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</p>

        {/* Image */}
        {post.image_url && (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image src={post.image_url || "/placeholder.svg"} alt={post.title} fill className="object-contain" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <Heart className="w-5 h-5" />
              <span className="font-medium">{post.likes_count} likes</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments_count} comments</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">{post.views_count} views</span>
            </div>
          </div>
          <ExpertChatButton postId={post.id} />
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} initialComments={comments} />
    </div>
  )
}
