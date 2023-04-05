import React, { useLayoutEffect, useMemo, useRef } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SearchInput } from "@/components/SearchInput"
import { Answer } from "@/components/perplexity/Answer"
import { Sources } from "@/components/perplexity/Sources"
import { usePineconeQuery } from "@/hooks/use-query"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

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

  useLayoutEffect(() => {
    let timeoutId
    if (
      status === "complete" &&
      last?.sourceDocs &&
      last?.sourceDocs?.length >= 1
    ) {
      timeoutId = setTimeout(() => {
        scrollToBottom()
      }, 500) // Adjust the timeout duration as needed

      return () => clearTimeout(timeoutId)
    }
  }, [status, last?.sourceDocs])

  useLayoutEffect(() => {
    let timeoutId
    if (status === "streaming") {
      timeoutId = setTimeout(() => {
        scrollToBottom()
      }, 200) // Adjust the timeout duration as needed
      scrollToBottom()
    }
    return () => clearTimeout(timeoutId)
  }, [status])

  return (
    <section className=" container mx-1 pb-8 md:pb-10">
      <div
        className={cn(
          " flex flex-col items-center justify-center",
          // Push search bar to the bottom of the screen with some padding when user answers
          aiAnswer && aiAnswer.length >= 1 ? "mb-6 pb-20" : ""
        )}
      >
        <div className=" w-full max-w-4xl">
          <LayoutGroup>
            {aiAnswer &&
              aiAnswer.map((answer, i) => {
                const isCurrentAnswer = aiAnswer.length - 1 === i
                return (
                  <motion.div
                    layout
                    layoutId={`${answer.question}-container-${i}`}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      opacity: { duration: 0.001 },
                      layout: { duration: 0.001 },
                    }}
                    key={`${answer.question}-container-${i}`}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={fadeIn}
                      className=" min-h-[500px] py-10 md:min-h-[350px] "
                    >
                      <div
                        className={cn(
                          "border-neutral-focus  overflow-x-auto rounded-xl border bg-neutral-100/50 p-4 shadow-md backdrop-blur ",
                          "hover:border-accent-focus text-left transition",
                          "dark:border-black/30 dark:bg-black/50",

                          isCurrentAnswer && status !== "loading"
                            ? "border border-teal-200 ring-1 ring-inset transition duration-150 dark:border-teal-400/80 dark:ring-indigo-500/40 "
                            : ""
                        )}
                      >
                        <Answer
                          content={answer.message}
                          error={status === "error"}
                          submittedQ={answer.question}
                        />
                        <AnimatePresence>
                          {answer.sourceDocs ? (
                            <Sources sources={answer.sourceDocs} />
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
          </LayoutGroup>
        </div>

        <div
          className={cn(
            "min-w-screen md:min-w-[850px]",
            aiAnswer.length >= 1 ? "fixed bottom-[20px]" : ""
          )}
        >
          <motion.div
            layout
            className="flex w-full max-w-4xl flex-col items-center justify-center "
          >
            <SearchInput
              status={status}
              value={userQuestion}
              handleClick={handleSubmit}
              handleChange={handleChange}
              loading={status === "loading" || status === "streaming"}
              placeholder="Query Embeddings"
            />
          </motion.div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </section>
  )
}
