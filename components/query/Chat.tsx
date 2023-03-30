import { useEffect, useState } from "react"
import { SearchInput } from "../SearchInput"
import { useCookies } from "react-cookie"
import { cn } from "@/lib/utils"
import {
  type ChatGPTMessage,
  ChatLine,
  LoadingChatLine,
} from "@/components/ChatLine"
import "@/components/ChatLine"
import { toast } from "@/hooks/use-toast"

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3"

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
]

export function Chat({ apiPath }: { apiPath: string }) {
  const [chatMessages, setChatMessages] =
    useState<ChatGPTMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [highlight, setHighlight] = useState(false)
  const [status, setStatus] = useState("idle")
  const [cookie, setCookie] = useCookies([COOKIE_NAME])

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  function handleChange(e) {
    setStatus("typing")
    return setInput(e.target.value)
  }

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setStatus("loading")
    setInput("")
    const newMessages = [
      ...chatMessages,
      { role: "user", content: message } as ChatGPTMessage,
    ]
    setChatMessages(newMessages)
    const last10messages = newMessages.slice(-10) // remember last 10 messages

    const response = await fetch(`/api/${apiPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    })

    console.log("Edge function returned.")

    if (!response.ok) {
      setStatus("error")
      return toast({
        title: "Chat API Error",
        description: response.statusText,
      })
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let lastMessage = ""

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      lastMessage = lastMessage + chunkValue

      setChatMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ])

      setStatus("complete")
    }
  }

  return (
    <div className="mx-auto">
      <div
        onMouseEnter={() => setHighlight(true)}
        onMouseLeave={() => setHighlight(false)}
        className={cn(
          " rounded-2xl bg-transparent p-2 dark:border-black/30 md:p-6 md:backdrop-blur-xl ",
          {
            "border border-neutral-900/50 transition duration-150 dark:border-neutral-700/50 md:shadow ":
              !highlight,
            " border border-teal-900/30   transition duration-150 ": highlight,
          }
        )}
      >
        {chatMessages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}

        {status === "loading" && <LoadingChatLine />}

        {chatMessages.length < 2 && (
          <span className="clear-both mx-auto flex grow text-mauve-11">
            Type a message to start the conversation
          </span>
        )}
        <div className="clear-both mt-6 flex items-center justify-center">
          <SearchInput
            className=""
            value={input}
            handleChange={handleChange}
            loading={status === "loading"}
            handleClick={() => sendMessage(input)}
            status={status}
            placeholder="ask anything"
          />
        </div>
      </div>
    </div>
  )
}
