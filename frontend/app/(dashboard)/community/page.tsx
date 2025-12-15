import Link from "next/link"
import { getPosts } from "@/lib/actions/community"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/community/post-card"
import { PlusCircle } from "lucide-react"

export default async function CommunityScreen() {
  const postsResult = await getPosts(20)
  const posts = postsResult.data || []

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 md:px-8 py-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[#0f1a14] dark:text-white text-3xl font-black">Community Forum</h1>
          <p className="text-[#568f6e] dark:text-gray-400 text-sm mt-1">
            Connect with farmers and experts. Share knowledge and solve problems together.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/community/agent">
            <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 font-semibold">
              <span>Expert Agent</span>
            </Button>
          </Link>
          <Link href="/community/create">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold">
              <PlusCircle className="w-5 h-5" />
              <span>Create Post</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Question", "Tip", "Discussion", "Success Story"].map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Be the first to share your farming knowledge or ask a question!
            </p>
            <Link href="/community/create">
              <Button className="bg-primary hover:bg-primary/90">Create First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
