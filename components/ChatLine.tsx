import { cn } from "@/lib/utils"
import MarkdownRenderer from "@/components/MarkdownRenderer"

type ChatGPTAgent = "user" | "system" | "assistant"

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  if (!content) {
    return null
  }

  return (
    <div
      className={
        role != "assistant" ? "float-right clear-both" : "float-left clear-both"
      }
    >
      <div className="!important max-w-md overflow-x-hidden md:w-full md:max-w-5xl">
        <div className="float-right mb-5 rounded-xl border border-neutral-700/40 bg-white/70 px-4 py-5 shadow-sm ring-1 ring-neutral-300/60 dark:border-neutral-500/30 dark:bg-black/40 dark:ring-neutral-500/60 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-1 gap-4">
              <p className="text-left font-aboreto text-xl font-bold text-neutral-600 dark:text-neutral-400">
                <a href="#" className="hover:underline">
                  {role == "assistant" ? "AI" : "You"}
                </a>
              </p>
              <div
                className={cn(
                  "text-neutral-900 dark:text-neutral-100",
                  role == "assistant"
                    ? "text-left font-semibold"
                    : "text-mauve-12"
                )}
              >
                <MarkdownRenderer
                  className="max-w-xs text-sm"
                  content={content}
                />
                {/* <div className="md:hidden">{content}</div> */}
                {/* <div className="md:hidden">
                  <MarkdownRenderer
                    className="max-w-xs text-sm"
                    content={content}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingChatLine() {
  return (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="min-w-0 flex-1">
          <p className="font-large text-xxl text-gray-900">
            <a href="#" className="hover:underline">
              AI
            </a>
          </p>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
              <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
            </div>
            <div className="h-2 rounded bg-zinc-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
