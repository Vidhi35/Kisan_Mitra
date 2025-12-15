"use client"

import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ExpertChatButtonProps {
  postId: string
}

export function ExpertChatButton({ postId }: ExpertChatButtonProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleStartChat = async () => {
    // For now, redirect to a placeholder page
    // In production, this would create a chat room and redirect there
    toast({
      title: "Feature coming soon!",
      description: "Expert chat functionality will be available soon",
    })
  }

  return (
    <Button
      onClick={handleStartChat}
      variant="outline"
      className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
    >
      <MessageSquarePlus className="w-4 h-4 mr-2" />
      Start Expert Chat
    </Button>
  )
}
