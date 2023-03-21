import { cn } from "@/lib/utils"
import MarkdownRenderer from "@/components/MarkdownRenderer"

// import Balancer from "react-wrap-balancer"

type ChatGPTAgent = "user" | "system" | "assistant"

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

// util helper to convert new lines to <br /> tags
// const convertNewLines = (text: string) =>
//   text.split("\n").map((line, i) => (
//     <span key={i}>
//       {line}
//       <br />
//     </span>
//   ))

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
      <div className="!important w-full max-w-5xl">
        <div className="float-right mb-5 rounded-lg bg-mauve-1 px-4 py-5 shadow-lg ring-1 ring-mauve-8 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-1 gap-4">
              <p className="text-left font-aboreto text-xl font-bold text-mauve-11">
                <a href="#" className="hover:underline">
                  {role == "assistant" ? "AI" : "You"}
                </a>
              </p>
              <div
                className={cn(
                  "text-mauve-12",
                  role == "assistant"
                    ? "text-left font-semibold"
                    : "text-mauve-12"
                )}
              >
                <MarkdownRenderer content={content} />
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
