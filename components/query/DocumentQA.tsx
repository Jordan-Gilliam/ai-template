import React, { useLayoutEffect, useMemo, useRef } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnswerCard } from "@/components/perplexity/Answer"
import { SearchInput } from "@/components/query/SearchInput"
import { usePineconeQuery } from "@/hooks/use-query"

export function DocumentQA({ namespace }) {
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

  const userQuestions = chatMessages.filter(
    (message) => message.type !== "apiMessage"
  )

  const last = aiAnswer[aiAnswer.length - 1]

  // useLayoutEffect(() => {
  //   let timeoutId
  //   if (
  //     status === "complete" &&
  //     last?.sourceDocs &&
  //     last?.sourceDocs?.length >= 1
  //   ) {
  //     timeoutId = setTimeout(() => {
  //       scrollToBottom()
  //     }, 500) // Adjust the timeout duration as needed

  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [status, last?.sourceDocs])

  // useLayoutEffect(() => {
  //   let timeoutId
  //   if (status === "streaming") {
  //     timeoutId = setTimeout(() => {
  //       scrollToBottom()
  //     }, 200) // Adjust the timeout duration as needed
  //     scrollToBottom()
  //   }
  //   return () => clearTimeout(timeoutId)
  // }, [status])

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
            {aiAnswer
              ? aiAnswer.map((answer, i) => {
                  const isCurrentAnswer = aiAnswer.length - 1 === i
                  console.log(userQuestions[i])
                  return (
                    <AnswerCard
                      key={`${answer.question}-container-${i}`}
                      answer={answer}
                      question={userQuestions[i].message}
                      isCurrentAnswer={isCurrentAnswer}
                      status={status}
                    />
                  )
                })
              : null}
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
