import React, { useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Answer, DocumentSources } from "@/components/Peplexity"
import ResizablePanel from "@/components/ResizablePanel"
import { SearchInput } from "@/components/SearchInput"
import { useFileChat } from "@/hooks/use-file-chat"

export function FileChat() {
  const {
    pendingSourceDocs,
    generateAnswer,
    setStatus,
    setUserQ,
    messages,
    pending,
    status,
    userQ,
  } = useFileChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  function handleChange(e) {
    setStatus("typing")
    return setUserQ(e.target.value)
  }

  function handleSubmit(e) {
    setUserQ("")
    return generateAnswer(e)
  }

  function scrollToBottom() {
    return messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              type: "apiMessage",
              question: userQ,
              message: pending,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ]
  }, [messages, pending, pendingSourceDocs])

  const aiAnswer = chatMessages.filter(
    (message) => message.type === "apiMessage"
  )

  // TODO: this is janky and not great
  useEffect(() => {
    if (status === "complete") {
      window.setTimeout(() => scrollToBottom(), 450)
    }
  }, [chatMessages, status])

  return (
    <section className="container flex flex-col justify-items-stretch gap-6  pb-8 md:pb-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="min-w-[750px] max-w-4xl">
          <ResizablePanel>
            {aiAnswer &&
              aiAnswer.map((answer, i) => {
                return (
                  <AnimatePresence mode="wait">
                    <motion.div className="my-10 space-y-10">
                      <motion.div
                        className={cn(
                          "bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md",
                          "hover:border-accent-focus cursor-copy text-left transition",
                          status === "loading" ? "animate-pulse" : ""
                        )}
                      >
                        <Answer
                          submittedQ={answer.question}
                          content={answer.message}
                          error={status === "error"}
                        />
                        <DocumentSources sources={answer.sourceDocs} />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )
              })}
          </ResizablePanel>
          <div className="flex min-w-[750px] max-w-4xl flex-col items-center justify-center">
            <SearchInput
              value={userQ}
              handleChange={handleChange}
              loading={status === "loading"}
              handleClick={handleSubmit}
              status={status}
              placeholder="Ask me anything about your file"
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
