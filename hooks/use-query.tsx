import { useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
  question?: string
}

type FileChatHook = {
  userQuestion: string
  setUserQuestion: React.Dispatch<React.SetStateAction<string>>
  status: string
  messages: Message[]
  setStatus: React.Dispatch<React.SetStateAction<string>>
  pendingSourceDocs?: Document[]
  history: [string, string][]
  answerStream?: string
  generateAnswer: (e: any) => Promise<void>
}

export function usePineconeQuery(namespace): FileChatHook {
  const [userQuestion, setUserQuestion] = useState("")
  const [status, setStatus] = useState("idle")

  const [messageState, setMessageState] = useState<{
    messages: Message[]
    answerStream?: string
    question?: string
    history: [string, string][]
    pendingSourceDocs?: Document[]
  }>({
    messages: [],
    history: [],
    pendingSourceDocs: [],
  })

  const { messages, answerStream, history, pendingSourceDocs } = messageState

  //   TODO: Make this more generic
  async function generateAnswer(e: any) {
    e.preventDefault()

    if (!userQuestion) {
      alert("Please input a question")
      return
    }

    const question = userQuestion.trim()

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
      answerStream: undefined,
    }))

    setUserQuestion("")
    setMessageState((state) => ({ ...state, answerStream: "" }))

    const ctrl = new AbortController()

    try {
      setStatus("loading")
      fetchEventSource("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          namespace: !!namespace ? namespace : "default-namespace",
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === "[DONE]") {
            setMessageState((state) => ({
              history: [...state.history, [question, state.answerStream ?? ""]],
              messages: [
                ...state.messages,
                {
                  type: "apiMessage",
                  message: state.answerStream ?? "",
                  question: state.question ?? "",
                  sourceDocs: state.pendingSourceDocs,
                },
              ],

              answerStream: undefined,
              pendingSourceDocs: undefined,
            }))

            setStatus("complete")
            ctrl.abort()
          } else {
            const data = JSON.parse(event.data)

            if (data.sourceDocs) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: data.sourceDocs,
              }))
            } else if (data.question) {
              setStatus("streaming")
              setMessageState((state) => ({
                ...state,
                question: data.question,
              }))
            } else {
              setMessageState((state) => ({
                ...state,
                answerStream: (state.answerStream ?? "") + data.data,
              }))
            }
          }
        },
      })
    } catch (error) {
      setStatus("error")
      console.log("error", error)
    }
  }

  return {
    userQuestion,
    setUserQuestion,
    status,
    setStatus,
    answerStream,
    pendingSourceDocs,
    history,
    messages,
    generateAnswer,
  }
}
