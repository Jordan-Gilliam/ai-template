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
  userQ: string
  setUserQ: React.Dispatch<React.SetStateAction<string>>
  status: string
  messages: Message[]
  setStatus: React.Dispatch<React.SetStateAction<string>>
  pendingSourceDocs?: Document[]
  history: [string, string][]
  pending?: string
  generateAnswer: (e: any) => Promise<void>
}

export function useFileChat(): FileChatHook {
  const [userQ, setUserQ] = useState("")
  const [status, setStatus] = useState("idle")

  const [messageState, setMessageState] = useState<{
    messages: Message[]
    pending?: string
    question?: string
    history: [string, string][]
    pendingSourceDocs?: Document[]
  }>({
    messages: [],
    history: [],
    pendingSourceDocs: [],
  })

  const { messages, pending, history, pendingSourceDocs } = messageState

  //   TODO: Make this more generic
  async function generateAnswer(e: any) {
    e.preventDefault()

    if (!userQ) {
      alert("Please input a question")
      return
    }

    const question = userQ.trim()

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

    setStatus("loading")
    setUserQ("")
    setMessageState((state) => ({ ...state, pending: "" }))

    const ctrl = new AbortController()

    try {
      fetchEventSource("/api/file-chat", {
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
                  question: state.question ?? "",
                  sourceDocs: state.pendingSourceDocs,
                },
              ],

              pending: undefined,
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
            }
            if (data.question) {
              setMessageState((state) => ({
                ...state,
                question: data.question,
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
      setStatus("error")
      console.log("error", error)
    }
  }

  return {
    userQ,
    setUserQ,
    status,
    setStatus,
    pending,
    pendingSourceDocs,
    history,
    messages,
    generateAnswer,
  }
}
