import React, { useMemo, useRef, useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { Document } from "langchain/document"
import { Bot, Loader2, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

const DEFAULT_QUESTION = ""

export function FileEmbeddings() {
  const [query, setQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const [error, setError] = useState<string | null>(null)
  const [messageState, setMessageState] = useState<{
    messages: Message[]
    pending?: string
    history: [string, string][]
    pendingSourceDocs?: Document[]
  }>({
    messages: [
      {
        message: "Hi, what would you like to learn about this legal case?",
        type: "apiMessage",
      },
    ],
    history: [],
    pendingSourceDocs: [],
  })

  const { messages, pending, history, pendingSourceDocs } = messageState

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(e: any) {
    e.preventDefault()

    setError(null)

    if (!query) {
      alert("Please input a question")
      return
    }

    const question = query.trim()

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
      pending: undefined,
    }))

    setLoading(true)
    setQuery("")
    setMessageState((state) => ({ ...state, pending: "" }))

    const ctrl = new AbortController()

    try {
      fetchEventSource("/api/document-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === "[DONE]") {
            setMessageState((state) => ({
              history: [...state.history, [question, state.pending ?? ""]],
              messages: [
                ...state.messages,
                {
                  type: "apiMessage",
                  message: state.pending ?? "",
                  sourceDocs: state.pendingSourceDocs,
                },
              ],
              pending: undefined,
              pendingSourceDocs: undefined,
            }))
            setLoading(false)
            ctrl.abort()
          } else {
            const data = JSON.parse(event.data)
            if (data.sourceDocs) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: data.sourceDocs,
              }))
            } else {
              setMessageState((state) => ({
                ...state,
                pending: (state.pending ?? "") + data.data,
              }))
            }
          }
        },
      })
    } catch (error) {
      setLoading(false)
      setError("An error occurred while fetching the data. Please try again.")
      console.log("error", error)
    }
  }

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              type: "apiMessage",
              message: pending,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ]
  }, [messages, pending, pendingSourceDocs])

  return (
    <section className="container flex flex-col justify-items-stretch gap-6 pt-6 pb-8 md:py-10">
      <div className="flex grow flex-col items-start gap-2">
        <h2 className="mt-10 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Ask me anything about the PDF
        </h2>

        <div className="w-full">
          <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex min-h-[300px] flex-col space-y-4 overflow-y-auto rounded border border-gray-400 p-4">
            {chatMessages.map((chat, index) => {
              return (
                <div className="chat-message" key={index}>
                  <div
                    className={cn(
                      "flex",
                      "items-end",
                      chat.type === "apiMessage" && "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs",
                        chat.type === "apiMessage" && "order-1"
                      )}
                    >
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600",
                            chat.type === "apiMessage" &&
                              "rounded-bl-none bg-gray-300 text-gray-600",
                            chat.type === "apiMessage" &&
                              "rounded-br-none bg-blue-600 text-white"
                          )}
                        >
                          {chat.message}
                        </span>
                      </div>
                    </div>
                    {chat.type !== "apiMessage" ? (
                      <User className="order-1 h-4 w-4" />
                    ) : (
                      <Bot className="order-1 h-4 w-4" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mb-2 pt-4 sm:mb-0">
            <div className="relative">
              <form onSubmit={handleSubmit} className="flex w-full">
                <textarea
                  disabled={loading}
                  ref={textAreaRef}
                  autoFocus={false}
                  rows={1}
                  maxLength={512}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    loading
                      ? "Waiting for response..."
                      : "What is this legal case about?"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mr-2 w-full rounded-md border border-gray-400 pl-2 text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                />

                <div className="items-center ">
                  <Button disabled={loading} type="submit">
                    {!loading ? (
                      <Send className="h-4 w-4" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
