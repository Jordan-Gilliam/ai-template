import React, { useEffect, useMemo, useRef } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { cn } from "@/lib/utils"
import { Answer, DocumentSources } from "@/components/Perplexity"
import { SearchInput } from "@/components/SearchInput"
import { usePineconeQuery } from "@/hooks/use-query"

export function PineconeQuery({ namespace }) {
  const {
    status,
    setStatus,
    userQuestion,
    setUserQuestion,
    pendingSourceDocs,
    generateAnswer,
    answerStream,
    messages,
  } = usePineconeQuery(namespace)
  let [ref, { height }] = useMeasure()
  const messageListRef = useRef<HTMLDivElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  function handleChange(e) {
    setStatus("typing")
    return setUserQuestion(e.target.value)
  }

  function handleSubmit(e) {
    setUserQuestion("")
    return generateAnswer(e)
  }

  function scrollToBottom() {
    return messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(answerStream
        ? [
            {
              type: "apiMessage",
              question: userQuestion,
              message: answerStream,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ]
  }, [messages, answerStream, pendingSourceDocs])

  const aiAnswer = chatMessages.filter(
    (message) => message.type === "apiMessage"
  )

  const last = aiAnswer[aiAnswer.length - 1]

  useEffect(() => {
    if (
      status === "complete" &&
      last?.sourceDocs &&
      last?.sourceDocs?.length >= 1
    ) {
      window.setTimeout(() => scrollToBottom(), 500)
    }
  }, [status, last?.sourceDocs])

  return (
    <section className="container flex flex-col justify-items-stretch gap-6  pb-8 md:pb-10">
      <LayoutGroup>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-full max-w-4xl md:min-w-[750px]">
            <motion.div
              animate={height ? { height } : {}}
              style={height ? { height } : {}}
              className="relative w-full overflow-hidden"
              transition={{
                staggerChildren: 1.5,
              }}
            >
              <div
                ref={ref}
                className={height ? "absolute inset-x-0" : "relative"}
              >
                <AnimatePresence>
                  {aiAnswer &&
                    aiAnswer.map((answer, i) => {
                      const isCurrentAnswer = aiAnswer.length - 1 === i
                      return (
                        <motion.div
                          className="my-10 space-y-10"
                          key={`${answer.question}-container-${i}`}
                        >
                          <motion.div
                            className={cn(
                              "border-neutral-focus  overflow-x-auto rounded-xl border bg-neutral-100/50 p-4 shadow-md backdrop-blur ",
                              "hover:border-accent-focus text-left transition",
                              "dark:border-black/30 dark:bg-black/50",

                              isCurrentAnswer && status !== "loading"
                                ? "border border-teal-200 transition duration-150 dark:border-teal-700"
                                : ""
                            )}
                          >
                            <Answer
                              content={answer.message}
                              error={status === "error"}
                              submittedQ={answer.question}
                            />
                            <AnimatePresence>
                              {answer.sourceDocs && (
                                <DocumentSources sources={answer.sourceDocs} />
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="flex max-w-4xl flex-col items-center justify-center md:min-w-[750px]">
              <SearchInput
                status={status}
                value={userQuestion}
                handleClick={handleSubmit}
                handleChange={handleChange}
                loading={status === "loading"}
                placeholder="Query Embeddings"
              />
              <div ref={messagesEndRef} />
            </motion.div>
          </div>
        </div>
      </LayoutGroup>
    </section>
  )
}
