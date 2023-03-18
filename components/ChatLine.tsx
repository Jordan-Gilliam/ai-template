import MarkdownRenderer from "@/components/MarkdownRenderer"
import { cn } from "@/lib/utils"
import Balancer from "react-wrap-balancer"

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props: any) => <Balancer {...props} />

type ChatGPTAgent = "user" | "system" | "assistant"

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  if (!content) {
    return null
  }
  const formattedMessage = convertNewLines(content)

  return (
    <div
      className={
        role != "assistant" ? "float-right clear-both" : "float-left clear-both"
      }
    >
      <BalancerWrapper className="!important w-full max-w-5xl">
        {/* <BalancerWrapper> */}
        <div className="float-right mb-5 rounded-lg bg-mauve-1 px-4 py-5 shadow-lg ring-1 ring-mauve-8 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-1 gap-4">
              <p className="text-left font-mono text-xl font-bold text-mauve-11">
                <a href="#" className="hover:underline">
                  {role == "assistant" ? "AI" : "You"}
                </a>
              </p>
              <div
                className={cn(
                  "text-mauve-12",
                  role == "assistant" ? "font-semibold " : "text-mauve-12"
                )}
              >
                <MarkdownRenderer content={content} />
              </div>
            </div>
          </div>
        </div>
      </BalancerWrapper>
    </div>
  )
}
