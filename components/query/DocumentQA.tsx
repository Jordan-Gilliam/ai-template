import React, { useLayoutEffect, useMemo, useRef } from "react"
import { useChat } from "ai/react"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnswerCard } from "@/components/perplexity/Answer"
import { SearchInput } from "@/components/query/SearchInput"
import { usePineconeQuery } from "@/hooks/use-query"

export function DocumentQA({ namespace }) {
  // const {
  //   status,
  //   setStatus,
  //   userQuestion,
  //   setUserQuestion,
  //   pendingSourceDocs,
  //   generateAnswer,
  //   answerStream,
  // } = usePineconeQuery(namespace)

  console.log(namespace)
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/query",
      body: {
        namespace: namespace,
      },
      sendExtraMessageFields: true,
      onResponse: (res) => {
        // trigger something when the response starts streaming in
        // e.g. if the user is rate limited, you can show a toast
        console.log("RESPONSE", res.body)
      },
      onFinish: (res) => {
        // do something with the completion result
        console.log("FINISH", res)
      },
    })
  // const { messages, isLoading, input, handleInputChange, handleSubmit } =
  //   useChat({})

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // function handleChange(e) {
  //   setStatus("typing")
  //   return setUserQuestion(e.target.value)
  // }

  // function handleSubmit(e) {
  //   setUserQuestion("")
  //   return generateAnswer(e)
  // }

  function scrollToBottom() {
    return messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // const chatMessages = useMemo(() => {
  //   return [
  //     ...messages,
  //     ...(answerStream
  //       ? [
  //           {
  //             type: "apiMessage",
  //             question: userQuestion,
  //             message: answerStream,
  //             sourceDocs: pendingSourceDocs,
  //           },
  //         ]
  //       : []),
  //   ]
  // }, [messages, answerStream, pendingSourceDocs])

  const aiAnswer = messages.filter((m) => m.role !== "user")
  const question = messages.filter((m) => m.role === "user")

  console.log(messages)

  const last = aiAnswer[aiAnswer.length - 1]

  // useLayoutEffect(() => {
  //   let timeoutId
  //   if (
  //     status === "complete"
  //     // last?.sourceDocs &&
  //     // last?.sourceDocs?.length >= 1
  //   ) {
  //     timeoutId = setTimeout(() => {
  //       scrollToBottom()
  //     }, 500) // Adjust the timeout duration as needed

  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [isLoading])

  // useLayoutEffect(() => {
  //   let timeoutId
  //   if (status === "streaming") {
  //     timeoutId = setTimeout(() => {
  //       scrollToBottom()
  //     }, 200) // Adjust the timeout duration as needed
  //     scrollToBottom()
  //   }
  //   return () => clearTimeout(timeoutId)
  // }, [isLoading])

  return (
    <section className=" container mx-1 pb-8 md:pb-10">
      <div
        className={cn(
          " flex flex-col items-center justify-center",
          // Push search bar to the bottom of the screen with some padding when user answers
          messages && aiAnswer.length >= 1 ? "mb-6 pb-20" : ""
        )}
      >
        <div className=" w-full max-w-4xl">
          <LayoutGroup>
            {aiAnswer
              ? aiAnswer.map((answer, i) => {
                  const isCurrentAnswer = aiAnswer.length - 1 === i
                  return (
                    <AnswerCard
                      key={`${question[i].content}-container-${i}`}
                      answer={answer.content}
                      question={question[i].content}
                      isCurrentAnswer={isCurrentAnswer}
                      status={isLoading}
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
              value={input}
              handleClick={handleSubmit}
              handleChange={handleInputChange}
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
