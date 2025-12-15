import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold text-primary mt-6 mb-4 border-b pb-2 border-primary/20" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mt-6 mb-3 flex items-center gap-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-outside ml-5 space-y-1 my-3 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-outside ml-5 space-y-1 my-3 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="pl-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-primary dark:text-primary-foreground bg-primary/10 px-1 rounded" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-gray-50 dark:bg-gray-800/50 rounded-r italic" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "")
                        return !className ? (
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm text-red-500" {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                    p: ({ node, ...props }) => (
                        <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
