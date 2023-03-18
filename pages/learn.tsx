import { useState } from "react"
import { ReactNode } from "react"
import type { NextPage } from "next"
import Image from "next/image"
// import LoadingDots from "@/components/LoadingDots"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ResizablePanel from "@/components/ResizablePanel"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AnimatePresence, motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

interface Props {
  children: ReactNode
  meta?: PageMeta
}

const DocsPage: NextPage<Props> = ({ children, meta: pageMeta }: Props) => {
  const [loading, setLoading] = useState(false)
  const [userQ, setUserQ] = useState("")
  const [answer, setAanswer] = useState<String>("")

  console.log("Streamed response: ", answer)

  const question = userQ

  const generateAnswer = async (e: any) => {
    e.preventDefault()
    if (!userQ) {
      return toast.error("Please enter a question!")
    }

    setAanswer("")
    setLoading(true)
    const response = await fetch("/api/learn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    })
    console.log("Edge function returned.")

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setAanswer((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <Layout>
      <div className="mx-auto flex min-h-screen flex-col items-center  py-2">
        <main className="mx-auto  flex min-h-screen w-full flex-1 flex-col items-center  px-4 py-2 text-center sm:mt-20">
          <h1 className="mb-6 max-w-xl text-2xl font-bold sm:text-4xl">
            Ask me anything
          </h1>
          <p className="mb-6 -mt-4 max-w-xl text-lg text-mauve-11">
            This chat leverages the embedded knowledge provided by you
          </p>
          <div className="w-full max-w-4xl">
            <Textarea
              className=" h-[150px] w-full border-2 border-mauve-9 shadow-sm placeholder:text-mauve-11"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              rows={4}
              placeholder={"e.g. ?"}
            />

            {!loading && (
              <Button
                variant="default"
                className=" mt-8 w-64 px-4 py-2 font-semibold"
                onClick={(e) => generateAnswer(e)}
              >
                Ask your question &rarr;
              </Button>
            )}
            {loading && (
              <Button className=" mt-2 w-full px-4 py-2 font-medium" disabled>
                {/* <LoadingDots color="white" style="xl" /> */}
              </Button>
            )}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            <ResizablePanel>
              <AnimatePresence mode="wait">
                <motion.div className="my-10 space-y-10">
                  {answer && (
                    <>
                      <div>
                        <h2 className="mx-auto text-3xl font-bold sm:text-4xl">
                          Here is your answer:{" "}
                        </h2>
                      </div>
                      {answer.split("SOURCES:").map((splitanswer, index) => {
                        return (
                          <div
                            className={`bg-neutral border-neutral-focus  overflow-x-auto rounded-xl border p-4 shadow-md transition ${
                              index === 0
                                ? "hover:border-accent-focus cursor-copy text-left"
                                : ""
                            }`}
                            onClick={() => {
                              if (index === 0) {
                                navigator.clipboard.writeText(splitanswer)
                                toast("Copied to clipboard!", {
                                  icon: "✂️",
                                })
                              }
                            }}
                            key={index}
                          >
                            {index === 0 ? (
                              <MarkdownRenderer content={splitanswer.trim()} />
                            ) : (
                              <>
                                <p>SOURCES:</p>
                                <ul>
                                  {splitanswer
                                    .trim()
                                    .split("\n")
                                    .filter((url) => url.trim().length > 0)
                                    .map((url) =>
                                      url.includes("http") ? (
                                        <li key={uuidv4()}>
                                          <a
                                            className="text-accent underline"
                                            target="_blank"
                                            href={url.replace(/^-+/g, "")} // Remove leading hyphens
                                          >
                                            {url.replace(/^-+/g, "")}
                                          </a>
                                        </li>
                                      ) : (
                                        <li key={uuidv4()}>{url}</li>
                                      )
                                    )}
                                </ul>
                              </>
                            )}
                            <style>
                              {`
                              p {
                                margin-bottom: 20px;
                              }
                            `}
                            </style>
                          </div>
                        )
                      })}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </ResizablePanel>
            <div className="mt-8 flex items-center justify-center">
              <Image
                className=" rotate-[180deg]"
                height={150}
                width={250}
                src="/logo-down-pink.svg"
                alt="logo"
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default DocsPage
