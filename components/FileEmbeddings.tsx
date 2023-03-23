import React, { useCallback, useState } from "react"
import { Bot, Loader2, Send, UploadCloud, User } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DEFAULT_QUESTION = ""

export function FileEmbeddings() {
  const [files, setFiles] = useState(null)
  const [question, setQuestion] = useState(DEFAULT_QUESTION)
  const [namespace, setNamespace] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAsking, setIsAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState([])

  const handleNamespaceChange = (e) => {
    setNamespace(e.target.value)
  }
  const handleQueryChange = (e) => {
    setQuestion(e.target.value)
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const handleUpload = useCallback(async () => {
    const formData = new FormData()
    Array.from(files).forEach((file: File) => {
      formData.append("file", file)
    })

    setIsUploading(true)
    await fetch("/api/document-ingest", {
      method: "post",
      body: formData,
      headers: {
        namespace: !!namespace ? namespace : undefined,
      },
    })
    setIsUploading(false)
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/json": [".json"],
      "text/plain": [".txt", ".md"],
    },
    multiple: false,
    maxFiles: 1,
  })

  const handleSubmit = useCallback(async () => {
    if (!question) {
      return
    }
    setIsAsking(true)
    setQuestion("")
    setChatHistory([
      ...chatHistory,
      {
        from: "user",
        content: question,
      },
    ])
    try {
      const response = await fetch("/api/document-chat", {
        body: JSON.stringify({
          question,
          chatHistory: chatHistory.reduce((prev, curr) => {
            prev += curr.content
            return prev
          }, ""),
          namespace: !!namespace ? namespace : undefined,
        }),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
      const answer = await response.json()

      setChatHistory((currentChatHistory) => [
        ...currentChatHistory,
        {
          from: "bot",
          content: answer.text,
        },
      ])

      setIsAsking(false)
    } catch (error) {
      console.log(error)
    }
  }, [question, chatHistory])

  return (
    <section className="container flex justify-items-stretch gap-6 pt-6 pb-8 md:py-10">
      <div className="flex min-w-[500px] flex-col items-start gap-2 ">
        <h2 className="mt-10 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Upload a PDF
        </h2>
        <div
          className="min-w-full rounded-md border border-slate-200 p-0 dark:border-slate-700"
          {...getRootProps()}
        >
          <div className="flex min-h-[150px] cursor-pointer items-center justify-center p-10">
            <input {...getInputProps()} />

            {files ? (
              <p>{files[0].name}</p>
            ) : (
              <>
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>
                    Drag and drop a file(.pdf, .txt, .md) here, or click to
                    select file
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex min-w-full">
          <label className="flex " htmlFor="namespace">
            Namespace: {namespace}
          </label>
          <input
            type="text"
            onChange={handleNamespaceChange}
            className="mr-1 min-w-fit rounded-md border border-gray-400 pl-2 text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="self-start">
          <Button disabled={!files || isUploading} onClick={handleUpload}>
            {!isUploading ? (
              <UploadCloud className="mr-2 h-4 w-4" />
            ) : (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
        </div>
      </div>

      <div className="flex grow flex-col items-start gap-2">
        <h2 className="mt-10 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Ask me anything about the PDF
        </h2>

        <div className="w-full">
          <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex min-h-[300px] flex-col space-y-4 overflow-y-auto rounded border border-gray-400 p-4">
            {chatHistory.map((chat, index) => {
              return (
                <div className="chat-message" key={index}>
                  <div
                    className={cn(
                      "flex",
                      "items-end",
                      chat.from === "bot" && "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs",
                        chat.from === "bot" && "order-1"
                      )}
                    >
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600",
                            chat.from === "user" &&
                              "rounded-bl-none bg-gray-300 text-gray-600",
                            chat.from === "bot" &&
                              "rounded-br-none bg-blue-600 text-white"
                          )}
                        >
                          {chat.content}
                        </span>
                      </div>
                    </div>
                    {chat.from === "user" ? (
                      <User className="order-1 h-4 w-4" />
                    ) : (
                      <Bot className="order-1 h-4 w-4" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <form>
            <div className="mb-2 pt-4 sm:mb-0">
              <div className="relative flex">
                <input
                  type="text"
                  value={question}
                  placeholder={DEFAULT_QUESTION}
                  onChange={handleQueryChange}
                  className="mr-2 w-full rounded-md border border-gray-400 pl-2 text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                />
                <div className="items-center sm:flex">
                  <Button
                    onClick={handleSubmit}
                    disabled={!question}
                    type="submit"
                  >
                    {!isAsking ? (
                      <Send className="h-4 w-4" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
